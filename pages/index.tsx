import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Main.module.css'
import React, { Component } from 'react'
import Header from './header'
import DevChatController from '../controller'

export interface MainState {
  isLoggedIn: boolean,
}

export interface MainProps extends WithRouterProps {}

/**
 * Component-Class for the main Page
 */
class Main extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
    }
  }

  /**
   * is always called, if component did mount
   */
  componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener);
  }
  
  /**
   * is always called, if component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener);
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
              <h1>
                Join Room
              </h1>
              <input type="text" placeholder="Chat-Key..." className='input'/>
              <div className='error'> 
                Chat-Key does not exist.
              </div>
              <button onClick={() => {
                // DevChatController.userJoinsRoom(Chat-Key) // method have to be implemented
                if (true /* Add join room method + cookie creation here */) {
                  router.push("/chat")
                }
              }}> 
                Join
              </button>
              <h1>
                Create Room
              </h1>
              <button onClick={async () => {
                if (await DevChatController.CreateChatRoom()) {
                  router.push("/chat");
                }
              }}> 
                Create
              </button>
              <h1>
                Settings
              </h1>
              <button onClick={() => router.push("/admin")}> 
                Admin Settings
              </button>
              <button onClick={() => router.push("/password")}> 
                Change Password
              </button>
              <button onClick={async () => {
                if (await DevChatController.deleteUser(DevChatController.getUserToken(), DevChatController.getUserFromToken(DevChatController.getUserToken()))) {
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
                width={1000}
                height={1000}
                layout="responsive"
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