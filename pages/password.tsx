import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Password.module.css'
import React, { Component } from 'react'
import Header from './header'
import DevChatController from '../controller'

export interface PasswordState {
  isLoggedIn: boolean,
}

export interface PasswordProps extends WithRouterProps {}

class Password extends Component<PasswordProps, PasswordState> {
  constructor(props: PasswordProps) {
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
    if (this.state.isLoggedIn) {
      return (
        <div>
          <Head>
            <title>Change password</title>
            <meta name="description" content="change password" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header pageInformation={"Change password"} showName={true} showExit={true} showLogout={false} />
          </header>
    
          <main>
            <div>
              <h1>
                Change Password
              </h1>
              <input type="password" placeholder="Old password..."/>
              <input type="password" placeholder="New password..."/>
              <input type="password" placeholder="Confirm new password..."/>
              <div> 
                Incorrect username or password. 
              </div>
              <button> 
                Log In 
              </button>
            </div>
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
          </main>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Change password</title>
            <meta name="description" content="change password" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
}

export default withRouter(Password)