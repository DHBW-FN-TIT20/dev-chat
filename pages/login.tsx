import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'

export interface LoginState {
  isNotLoggedIn: boolean,
}

export interface LoginProps extends WithRouterProps {
  showError: boolean;
}

/**
 * @class Login Componet Class
 * @component
 */
class Login extends Component<LoginProps, LoginState> {
  username = '';
  password = '';
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      isNotLoggedIn: false,
    }
    
  }

  /**
   * is always called, if component did mount
   */
  componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener)
  }

  /**
   * is always called, if component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener)
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
   * This method checks and verifys the current user-token. If valid, it routes to root, if not, the isNotLoggedIn state is set to true.
   */
  async checkLoginState() {
    let currentToken = DevChatController.getUserToken();
    if (await DevChatController.verifyUserByToken(currentToken)) {
      const { router } = this.props
      router.push("/")
    } else {
      this.setState({isNotLoggedIn: true})
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

    if (this.state.isNotLoggedIn) {
      return (
        <div>
          <Head>
            <title>Login</title>
            <meta name="description" content="login page" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header pageInformation="Welcome" showName={false} showExit={false} showLogout={false} />
          </header>

          <main>          
            <div className={styles.container}>
              <div className={styles.left}>
                <h1>
                Login
              </h1>
              <input type="text" placeholder="Username..." onChange={(event) => {this.username = event.target.value}}/>
              <input type="password" placeholder="Password..." onChange={(event) => {this.password = event.target.value}}/>
                {
                  !this.props.showError && 
                  <div className='error' id={styles.error1}> 
                    Incorrect username or password. 
                  </div>
                }
                <button onClick={async () => {
                  if (await DevChatController.loginUser(this.username, this.password)) {
                    router.push("/")
                  } // change to state later
                }}> Login </button>
                <div className='create'>
                  Or&nbsp; 
                  <a onClick={() => router.push("/register")}>
                    create Account
                  </a> 
                  &nbsp;instead.
                </div>
              </div>
            
            <div className={styles.right}>
              <div className="image">
                <Image
                  priority
                  src={"/logo.png"}
                  alt="DEV-CHAT Logo"
                  width={1000}
                  height={1000}
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
            <title>Login</title>
            <meta name="description" content="login page" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
}

export default withRouter(Login)