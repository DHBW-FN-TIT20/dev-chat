import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Password.module.css'
import React, { Component } from 'react'
import Header from './header'
import DevChatController from '../controller'

export interface PasswordState {
  isLoggedIn: boolean,
  inputOldPassword: string,
  inputNewPassword: string,
  inputConfirmPassword: string,
  feedBackMessage: string,
  oldPasswordIsCorrect: boolean,
}

export interface PasswordProps extends WithRouterProps {}

class Password extends Component<PasswordProps, PasswordState> {
  constructor(props: PasswordProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      inputOldPassword: "",
      inputNewPassword: "",
      inputConfirmPassword: "",
      feedBackMessage: "",
      oldPasswordIsCorrect: true,
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
    const { router } = this.props

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
            <div className={styles.container}>
            <div className={styles.left}>
              <h1>
                Change Password
              </h1>
              <input type="password" placeholder="Old password..."
              onChange={(event) => { 
                this.setState({inputOldPassword: event.currentTarget.value}) 
                this.updateFeedbackMessage(this.state.oldPasswordIsCorrect, event.currentTarget.value, this.state.inputNewPassword, this.state.inputConfirmPassword); 
              }} 
              value={this.state.inputOldPassword}/>
              <input type="password" placeholder="New Password..." 
                onChange={(event) => { 
                  this.setState({inputNewPassword: event.currentTarget.value }) 
                  this.updateFeedbackMessage(this.state.oldPasswordIsCorrect, this.state.inputOldPassword, event.currentTarget.value, this.state.inputConfirmPassword); 
                }} 
                value={this.state.inputNewPassword} />
              <input type="password" placeholder="Confirm New Password..." 
                onChange={(event) => { 
                  this.setState({ inputConfirmPassword: event.currentTarget.value }) 
                  this.updateFeedbackMessage(this.state.oldPasswordIsCorrect, this.state.inputOldPassword, this.state.inputNewPassword, event.currentTarget.value);
                }} 
                value={this.state.inputConfirmPassword}/>
              <div className='error' hidden={this.state.feedBackMessage === ""}>{this.state.feedBackMessage}</div>
              <button onClick={async() => {
                let oldPasswordIsCorrect = await DevChatController.changePassword(DevChatController.getUserToken(), this.state.inputOldPassword, this.state.inputNewPassword)
                this.setState({
                  oldPasswordIsCorrect: oldPasswordIsCorrect
                })
                if (oldPasswordIsCorrect) {
                  router.push("/")
                }
                else {
                  this.updateFeedbackMessage(oldPasswordIsCorrect, this.state.inputOldPassword, this.state.inputNewPassword, this.state.inputConfirmPassword)
                  this.setState({
                    inputConfirmPassword: "",
                    inputOldPassword: "",
                    inputNewPassword: "",
                  })

                }
              }}> 
                Change Password 
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
            <title>Change password</title>
            <meta name="description" content="change password" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
  
  private updateFeedbackMessage(oldPasswordIsCorrect: boolean, inputOldPassword: string, inputNewPassword: string, inputConfirmPassword: string) {
    console.log("updateFeedbackMessage()");
    console.table({oldPasswordIsCorrect, inputOldPassword, inputNewPassword, inputConfirmPassword})
    let feedBackMessage: string = "";
    
    if(!oldPasswordIsCorrect) {
      feedBackMessage = "Old password is incorrect or the new password doesn't match the requirements"
    }

    if(inputOldPassword === inputNewPassword) {
      feedBackMessage = "Old password cannot be new password"
    }
    else if (inputConfirmPassword !== inputNewPassword) {
      feedBackMessage = "Passwords are not correct";  
    } 
      else if (inputOldPassword === "" || inputNewPassword === "" || inputConfirmPassword === "") {
      feedBackMessage = "Please enter all required fields"
    } 

    this.setState({ feedBackMessage: feedBackMessage });
  }
}

export default withRouter(Password)