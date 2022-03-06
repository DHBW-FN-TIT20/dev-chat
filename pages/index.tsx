import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Main.module.css'
import React, { Component } from 'react'
import Header from '../components/header'
import FrontEndController from '../controller/frontEndController'

export interface MainState {
  isLoggedIn: boolean;
  inputChatKey: string;
  feedbackMessage: string;
  doesChatKeyExists: boolean;
}

export interface MainProps extends WithRouterProps { }

/**
 * Class/Component for the Main Page
 * @component
 * @category Pages
 */
class Main extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      inputChatKey: "",
      feedbackMessage: "",
      doesChatKeyExists: false,
    }
  }

  /**
   * is always called, if component did mount
   */
  componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener);
    this.connectToParamChatKey();
  }

  /**
   * is always called, if component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener);
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it revalidates the login state.
   */
  private storageTokenListener = async (event: any) => {
    if (event.key === "DevChat.auth.token") {
      this.checkLoginState();
    }
  }

  /**
   * This method checks and verifys the current user-token. If invalid, it routes to login, if not, the isLoggedIn state is set to true.
   */
  private async checkLoginState() {
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
   * This method updates the feedback-message in the chatKey error div
   */
  private updateFeedbackMessage(doesChatKeyExists: boolean) {
    console.log("updateFeedbackMessage()");
    let feedbackMessage: string = "";

    if (!doesChatKeyExists) {
      feedbackMessage = "Chat-Key does not exists";
    }
    console.log("This in updateMessage " + this);

    this.setState({ feedbackMessage: feedbackMessage });
  }

  /**
   * Handle of the Keypressed-Event from the chatKey Input
   */
  private handleJoinEnterKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      await this.onJoinButtonClick();
    }
  }

  /**
   * This method trys to join a chat
   */
  private onJoinButtonClick = async () => {
    const { router } = this.props
    this.setState({ feedbackMessage: "" });
    const doesChatKeyExists = await FrontEndController.doesChatKeyExists(this.state.inputChatKey);
    this.setState({ doesChatKeyExists: doesChatKeyExists });
    if (this.state.doesChatKeyExists) {
      console.log("EXISTS")
      FrontEndController.setChatKeyCookie(this.state.inputChatKey);
      router.push("/chat");
    } else {
      console.log("NOT EXISTS");
      this.setState({ inputChatKey: "" });
    }
    this.updateFeedbackMessage(this.state.doesChatKeyExists);
  }

  /**
   * This method checks whether there is a parameter chatKey in the URL.
   * If there is, it connects to the chat with the chatKey.
   */
  private async connectToParamChatKey() {

    // check for parameter "chatkey" in url
    const urlParams = new URLSearchParams(window.location.search);
    const chatKey = urlParams.get("chatkey") || urlParams.get("chatKey") || "";

    // if there is a chatKey, check if it exists and connect to the chat
    if (chatKey !== "") {
      const { router } = this.props
      const doesChatKeyExists = await FrontEndController.doesChatKeyExists(chatKey)
      if (doesChatKeyExists) {
        console.log("EXISTS")
        FrontEndController.setChatKeyCookie(chatKey);
        router.push("/chat")
      } else {
        console.log("NOT EXISTS")
      }
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    /**
     * Initialize Router to navigate to other pages
     */
    const { router } = this.props

    if (this.state.isLoggedIn) {
      return (
        <div>
          <Head>
            <title>Main page</title>
            <meta name="description" content="main page" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header pageInformation="MAIN MENU" showName={true} showExit={false} showLogout={true} />
          </header>

          <main>
            <div className={styles.container}>
              <div className={styles.left}>
                <a hidden={true} href="/project-docs.pdf">
                  Docs
                </a>
                <h1>
                  Join Room
                </h1>
                <input
                  type="text"
                  placeholder="Chat-Key..."
                  className='input'
                  onChange={(event) => { this.setState({ inputChatKey: event.currentTarget.value }) }}
                  onKeyPress={this.handleJoinEnterKeyPress}
                  value={this.state.inputChatKey} />
                <div className='error' hidden={this.state.feedbackMessage === ""}>{this.state.feedbackMessage}</div>
                <button onClick={this.onJoinButtonClick}> Join </button>
                <h1>
                  Create Room
                </h1>
                <button onClick={async () => {
                  if (await FrontEndController.addChatKey()) {
                    router.push("/chat");
                  }
                }}>
                  Create
                </button>
                <h1>
                  Settings
                </h1>
                <button
                  hidden={!FrontEndController.getAdminValueFromToken(FrontEndController.getUserToken())}
                  onClick={() => router.push("/admin")}
                >
                  Admin Settings
                </button>
                <button onClick={() => router.push("/password")}>
                  Change Password
                </button>
                <button onClick={async () => {
                  if (await FrontEndController.deleteUser(FrontEndController.getUserToken(), FrontEndController.getUserFromToken(FrontEndController.getUserToken()))) {
                    router.push("/login")
                  }
                }}>
                  Delete Account
                </button>
              </div>
              <div className={styles.right}>
                <div className="image">
                  <Image
                    priority
                    src={"/logo.png"}
                    alt="DEV-CHAT Logo"
                    // width={1000}
                    // height={1000}
                    // layout="responsive"
                    objectFit='contain'
                    sizes='fitContent'
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Main page</title>
            <meta name="description" content="main page" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
}


export default withRouter(Main)
