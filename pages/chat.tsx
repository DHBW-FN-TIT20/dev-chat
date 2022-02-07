import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'
import { IChatMessage } from '../public/interfaces'

export interface ChatState {
  isLoggedIn: boolean,
  isChatKeyValid: boolean,
  chatLineInput: string,
  messages: IChatMessage[],
}

export interface ChatProps extends WithRouterProps { }

class Chat extends Component<ChatProps, ChatState> {
  private messageFetchInterval: any = undefined;
  private currentChatKeyCookie: string = "";
  constructor(props: ChatProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      isChatKeyValid: false,
      chatLineInput: '',
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
    // Login validated
    DevChatController.startMessageFetch();
    this.messageFetchInterval = setInterval(() => {
      // Check for chat key cookie changes, if changed, exit chat
      if (DevChatController.getChatKeyFromCookie() !== this.currentChatKeyCookie) {
        const { router } = this.props;
        router.push("/")
      }
      this.setState({messages: DevChatController.chatMessages})
    }, 500);

  }
  
  /**
   * is always called, if component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener);
    clearInterval(this.messageFetchInterval);
    DevChatController.stopMessageFetch();
    DevChatController.clearChatKeyCookie();
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
   handleEnterKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      console.log("Entered new Message: " + this.state.chatLineInput);
      DevChatController.enteredNewMessage(this.state.chatLineInput);
      this.setState({ chatLineInput: "" });
    }
  }

  /**
   * Handle of the OnChange-Event from the Input
   * updates the Value of the Input-Line
   * @param event Occured Event
   */
  handleChatLineInput = (event: any) => {
    this.setState({ chatLineInput: event.target.value });
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
                        <td>{message.user}</td>
                        <td>at</td>
                        <td>{new Date(message.date).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hourCycle: 'h24',
                            })}</td>
                        <td>-&gt;</td>
                        <td>{message.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <input className={styles.chatBox} value={this.state.chatLineInput} type="text" placeholder="Write a message..." onKeyPress={this.handleEnterKeyPress} onChange={this.handleChatLineInput} />
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