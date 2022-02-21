import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'
import { IChatMessage } from '../public/interfaces'
import { setStringOnFixLength } from '../shared/set_string_on_fix_length'
import SocketIOClient from "socket.io-client";
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'


export interface ChatState {
  isLoggedIn: boolean,
  isChatKeyValid: boolean,
  messages: IChatMessage[],
}

export interface ChatProps extends WithRouterProps { }

class Chat extends Component<ChatProps, ChatState> {
  private blockFetchMessages = false;
  private socket: any = null;
  private messageFetchInterval: any = undefined;
  private currentChatKeyCookie: string = "";
  private chatLineInput: string = "";
  private historyMessage: string[] = ["",];
  private historyIndex: number = 0;
  constructor(props: ChatProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      isChatKeyValid: false,
      messages: [],
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
    if (await DevChatController.doesChatKeyExists(DevChatController.getChatKeyFromCookie())) {
      this.currentChatKeyCookie = DevChatController.getChatKeyFromCookie();
      this.setState({isChatKeyValid: true});
    } else {
      const { router } = this.props;
      router.push("/")
    }
    // // Login validated
    DevChatController.joinRoomMessage();
    DevChatController.chatMessages = [];
    const tempChatMessages = await DevChatController.updateChatMessages()
    this.setState({messages: tempChatMessages})
    
    // DevChatController.startMessageFetch();
    // this.messageFetchInterval = setInterval(() => {
    //   // Check for chat key cookie changes, if changed, exit chat
    //   if (DevChatController.getChatKeyFromCookie() !== this.currentChatKeyCookie) {
    //     const { router } = this.props;
    //     router.push("/")
    //   }
    //   this.setState({messages: DevChatController.chatMessages})
    // }, 2000);
      
    // get the url
    const url = window.location.href.split("?")[0].split("#")[0].split("/",3).join("/");

    // init socket 
    // TODO: route the chat key to the server + filter at subsciption
    this.socket = SocketIOClient(url, {
      path: "/api/messages/socketio",
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
        const tempChatMessages:IChatMessage[] = await DevChatController.updateChatMessages();
        this.setState({messages: tempChatMessages})
        this.blockFetchMessages = false;
      }
    });
  }
  
  /**
   * is always called, if component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener);
    DevChatController.leaveRoomMessage();
    DevChatController.clearChatKeyCookie();

    if (this.socket) {
      this.socket.disconnect();
    }

  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it revalidates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event: any) => {
    if (event.key === "DevChat.auth.token") {
      this.checkLoginState();
    }
  }

  /**
   * This method checks and verifys the current user-token. If invalid, it routes to login, if not, the isLoggedIn state is set to true.
   */
  async checkLoginState() {
    let currentToken = DevChatController.getUserToken();
    if (await DevChatController.verifyUserByToken(currentToken)) {
      // logged in
      this.setState({isLoggedIn: true})
    } else {
      // not logged in
      const { router } = this.props
      router.push("/login")
    }
  }

  /**
  * Handle of the Keypressed-Event from the Input
  * Checks if Enter was pressed
  * @param event Occurred Event
  */
  handleEnterKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      this.historyMessage[this.historyMessage.length -1] = this.chatLineInput;
      this.historyMessage.push("");
      this.historyIndex = this.historyMessage.length -1;
      console.log("Entered new Message: " + this.chatLineInput);
      DevChatController.enteredNewMessage(this.chatLineInput);
      event.target.value = "";
      this.chatLineInput = "";
    }
  }

  /**
   * Handle of the OnChange-Event from the Input
   * updates the Value of the Input-Line
   * @param event Occured Event
   */
  handleChatLineInput = (event: any) => {
    this.chatLineInput = event.target.value
  }

  /**
   * Handle of KeyDown-Event from the Input
   * Checks if Arrow up or down is pressed to load the History
   * @param event Occured Event
   */
  handleKeyDown = (event:any) => {
    if(this.historyMessage.length == 1){
      //no History in local Browser
      return;
    }
    if(event.key == "ArrowUp" && this.historyIndex != 0){
      this.historyIndex --;
      this.chatLineInput = this.historyMessage[this.historyIndex];
      event.target.value = this.historyMessage[this.historyIndex];
    }
    else if(event.key == "ArrowDown" && this.historyIndex != this.historyMessage.length -1){
      this.historyIndex ++;
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
            <Header pageInformation={DevChatController.getChatKeyFromCookie()} showName={true} showExit={true} showLogout={false} />
          </header>

          <main>
            <div>
              <div className={styles.messageTableDiv}> 
                <table>
                  <tbody>
                    {this.state.messages.map(message => (
                      <tr key={message.id}>
                          <td className={styles.msg}>
                          <p className={styles.tableUser}>
                            {setStringOnFixLength(String(message.user), 16)}
                          </p>
                          <p className={styles.tableAt}>
                            &nbsp;at&nbsp;
                          </p>
                          <p className={styles.tableDate}>
                            {new Date(message.date).toLocaleDateString('de-DE', {
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
                className={styles.chatBox} 
                type="text" placeholder="Write a message..." 
                onKeyPress={this.handleEnterKeyPress} 
                onChange={this.handleChatLineInput}
                onKeyDown={this.handleKeyDown}
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