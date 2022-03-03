import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import FrontEndController from '../controller/frontEndController'
import Header from '../components/header'
import { IFChatMessage } from '../public/interfaces'
import { setStringOnFixLength } from '../shared/set_string_on_fix_length'
import SocketIOClient from "socket.io-client";

export interface ChatState {
  isLoggedIn: boolean;
  isChatKeyValid: boolean;
  messages: IFChatMessage[];
  isSendingMessage: boolean;
}

export interface ChatProps extends WithRouterProps { }

/**
 * @category Page
 */
class Chat extends Component<ChatProps, ChatState> {
  private blockFetchMessages = false;
  private redoFetch = false;
  private socket: any = null;
  private currentChatKeyCookie: string = "";
  private chatLineInput: string = "";
  private historyMessage: string[] = [""];
  private historyIndex: number = 0;
  private chatLine: any;
  constructor(props: ChatProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      isChatKeyValid: false,
      messages: [],
      isSendingMessage: false,
    }
  }

  /**
   * is always called, if component did mount
   */
  async componentDidMount() {
    await this.checkLoginState();
    // Check for changes in local state -> reevaluate login
    window.addEventListener('storage', this.storageTokenListener);
    // Logged in -> Check if current chat key cookie is valid
    if (await FrontEndController.doesChatKeyExists(FrontEndController.getChatKeyFromCookie())) {
      this.currentChatKeyCookie = FrontEndController.getChatKeyFromCookie();
      this.setState({ isChatKeyValid: true });
    } else {
      const { router } = this.props;
      router.push("/")
    }
    // Login validated
    await FrontEndController.joinRoomMessage();
    FrontEndController.chatMessages = [];
    const tempChatMessages = await FrontEndController.updateChatMessages()
    this.setState({ messages: tempChatMessages })

    // get the url
    const url = window.location.href.split("?")[0].split("#")[0].split("/", 3).join("/");

    // init socket 
    this.socket = SocketIOClient(url, {
      path: "/api/messages/socketio",
      auth: {
        headers: {
          chatKey: FrontEndController.getChatKeyFromCookie(),
          userToken: FrontEndController.getUserToken()
        }
      }
    });

    // register connection event
    this.socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", this.socket.id);
    });

    // register message event
    this.socket.on("message", async (chatKey: string) => {
      if (!this.blockFetchMessages && chatKey === this.currentChatKeyCookie) {
        this.blockFetchMessages = true;
        console.log("SOCKET MESSAGE!");
        // get table scroll level for auto scroll
        const elem = document.getElementById("chatTable");
        let elemHeight: number = NaN;
        if (elem !== null) {
          elemHeight = elem.scrollTop;
        }
        // fetch new messages
        do {
          console.log("-----------------FETCH------------------")
          this.redoFetch = false;
          const tempChatMessages: IFChatMessage[] = await FrontEndController.updateChatMessages();
          this.setState({ messages: tempChatMessages });
        } while (this.redoFetch);
        this.blockFetchMessages = false;
        // Check for scrolling (If user can see one of the newest three lines (is at bottom of page))
        if (elem !== null && elemHeight >= -100) {
          elem.scrollTo(0, 0);
        }
      } else if (this.blockFetchMessages) {
        this.redoFetch = true;
      }
    });
  }

  /**
   * is always called, if component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener);
    FrontEndController.leaveRoomMessage();
    FrontEndController.clearChatKeyCookie();

    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it revalidates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  private storageTokenListener = async (event: any) => {
    if (event.key === "DevChat.auth.token") {
      this.checkLoginState();
    }
  }

  /**
   * This method checks and verifys the current user-token. If invalid, it routes to login, if not, the isLoggedIn state is set to true.
   */
  private checkLoginState = async () => {
    const currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken)) {
      // logged in
      this.setState({ isLoggedIn: true });
    } else {
      // not logged in
      const { router } = this.props;
      router.push("/login");
    }
  }

  /**
  * Handle of the Keypressed-Event from the Input
  */
  private handleEnterKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      this.historyMessage[this.historyMessage.length - 1] = this.chatLineInput;
      this.historyMessage.push("");
      this.historyIndex = this.historyMessage.length - 1;
      console.log("Entered new Message: " + this.chatLineInput);
      this.setState({isSendingMessage: true});
      await FrontEndController.enteredNewMessage(this.chatLineInput);
      this.setState({isSendingMessage: false});
      this.chatLine.focus();
      document.getElementById("chatLineInput")?.focus();
      event.target.value = "";
      this.chatLineInput = "";
    }
  }

  /**
   * Handle of the OnChange-Event from the Input
   * updates the Value of the Input-Line
   */
  private handleChatLineInput = (event: any) => {
    this.chatLineInput = event.target.value;
  }

  /**
   * Handle of KeyDown-Event from the Input
   * Checks if Arrow up or down is pressed to load the History
   */
  private handleKeyDown = (event: any) => {
    if (this.historyMessage.length == 1) {
      //no History in local Browser
      return;
    }

    if (event.key == "ArrowUp" && this.historyIndex != 0) {
      this.historyIndex--;
      this.chatLineInput = this.historyMessage[this.historyIndex];
      event.target.value = this.historyMessage[this.historyIndex];
      setTimeout(() => { event.target.selectionStart = event.target.selectionEnd = event.target.value.length; }, 1);
    } else if (event.key == "ArrowDown" && this.historyIndex != this.historyMessage.length - 1) {
      this.historyIndex++;
      event.target.value = this.historyMessage[this.historyIndex];
      this.chatLineInput = this.historyMessage[this.historyIndex];
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    if (this.state.isLoggedIn && this.state.isChatKeyValid) {
      return (
        <div>
          <Head>
            <title>Chat</title>
            <meta name="description" content="chat" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header pageInformation={FrontEndController.getChatKeyFromCookie()} showName={true} showExit={true} showLogout={false} />
          </header>

          <main>
            <div>
              <div className={styles.messageTableDiv} id="chatTable">
                <table>
                  <tbody>
                    {this.state.messages.map(message => (
                      <tr key={message.id}>
                        <td className={styles.msg}>
                          <p className={styles.tableUser}>
                            {setStringOnFixLength(String(message.username), 16)}
                          </p>
                          <p className={styles.tableAt}>
                            &nbsp;at&nbsp;
                          </p>
                          <p className={styles.tableDate}>
                            {new Date(message.dateSend).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hourCycle: 'h24',
                            })}
                          </p>
                          <p className={styles.tableArrow}>
                            &nbsp;-&gt;&nbsp;
                          </p>
                          <p className={styles.tableMessage}>
                            {message.message}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <input 
                key={"chatLineInput"}
                className={styles.chatBox} 
                type="text" placeholder="Write a message..." 
                onKeyPress={this.handleEnterKeyPress} 
                onChange={this.handleChatLineInput}
                onKeyDown={this.handleKeyDown}
                disabled={this.state.isSendingMessage}
                style={{
                  color: this.state.isSendingMessage ? "#9b9b9b" : "white",
                }}
                ref={(inputElement) => { this.chatLine = inputElement; }} 
              />

            </div>
          </main>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Chat</title>
            <meta name="description" content="chat" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
}

export default withRouter(Chat)