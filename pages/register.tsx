import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import React, { Component } from 'react'
import Header from './header'
import DevChatController from '../controller'

export interface RegisterState {
  isNotLoggedIn: boolean,
  userAlreadyExists: boolean,
  inputUsername: string,
  inputPassword: string,
  inputConfirmPassword: string,
  feedbackMessage: string,
  newUsernameValid: boolean,
  newPasswordValid: boolean
}

export interface RegisterProps extends WithRouterProps {}

/**
 * @class Class of the register Component
 * @component
 */
class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props)
    this.state = {
      isNotLoggedIn: false,
      userAlreadyExists: false,
      inputUsername: "",
      inputPassword: "",
      inputConfirmPassword: "",
      feedbackMessage: "",
      newPasswordValid: true,
      newUsernameValid: true,
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
            <title>Register</title>
            <meta name="description" content="register" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header>
            <Header pageInformation={"Register"} showName={false} showExit={false} showLogout={false} />
          </header>

          <main>
            <div className={styles.container}>
              <div className={styles.left}>
                <h1>
                  Create Account
                </h1>
                <input type="text" placeholder="Username..."
                  onChange={(event) => {
                    this.setState({ inputUsername: event.currentTarget.value, userAlreadyExists: false })
                    this.updateFeedbackMessage(false, event.currentTarget.value, this.state.inputPassword, this.state.inputConfirmPassword, this.state.newPasswordValid, this.state.newUsernameValid); 
                  }}
                  value={this.state.inputUsername} />
                <input type="password" placeholder="Password..."
                  onChange={(event) => {
                    this.setState({ inputPassword: event.currentTarget.value })
                    this.updateFeedbackMessage(this.state.userAlreadyExists, this.state.inputUsername, event.currentTarget.value, this.state.inputConfirmPassword, this.state.newPasswordValid, this.state.newUsernameValid); 
                  }}
                  value={this.state.inputPassword} />
                <input type="password" placeholder="Confirm Password..."
                  onChange={(event) => {
                    this.setState({ inputConfirmPassword: event.currentTarget.value })
                    this.updateFeedbackMessage(this.state.userAlreadyExists, this.state.inputUsername, this.state.inputPassword, event.currentTarget.value, this.state.newPasswordValid, this.state.newUsernameValid);
                  }}
                  value={this.state.inputConfirmPassword} />

                <div hidden={this.state.feedbackMessage === ""}>{this.state.feedbackMessage}</div>

                <button onClick={async () => {
                  let userAlreadyExists = await DevChatController.userAlreadyExists(this.state.inputUsername)
                  let vNewUsernameValid: boolean = true;
                  let vNewPasswordValid: boolean = true;
                  this.setState({
                    userAlreadyExists: userAlreadyExists
                  })
                  if (!this.state.userAlreadyExists && this.state.inputConfirmPassword === this.state.inputPassword) {
                    console.log("Pressed Register Button")
                    let registerUserReturnString :string = await DevChatController.registerUser(this.state.inputUsername, this.state.inputPassword);
                    console.log(registerUserReturnString)
                    if (registerUserReturnString == "True") {
                      this.setState({newPasswordValid: true, newUsernameValid: true});
                      router.push("/")
                    }
                    else if(registerUserReturnString == "error_username_password"){
                      //Password and username not Valid
                      vNewUsernameValid = false;
                      vNewPasswordValid = false;
                    }
                    else if (registerUserReturnString == "error_username"){
                      vNewUsernameValid = false;
                    }
                    else if(registerUserReturnString == "error_password"){
                      vNewPasswordValid = false;
                    }
                  }
                  this.setState({newPasswordValid: vNewPasswordValid, newUsernameValid: vNewUsernameValid});
                  this.updateFeedbackMessage(userAlreadyExists, this.state.inputUsername, this.state.inputPassword, this.state.inputConfirmPassword, vNewPasswordValid, vNewUsernameValid);
                }}>
                  Create
                </button>
                <div>
                  Or&nbsp;
                  <a onClick={() => router.push("/login")}>
                    login
                  </a>
                  &nbsp;instead.
                </div>
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
                  layout="responsive"
                />
              </div>
            </div>
        </main >
      </div>

    )
    } else {
      return (
        <div>
          <Head>
            <title>Register</title>
            <meta name="description" content="register" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </div>
      )
    }
  }
  
  private updateFeedbackMessage(userAlreadyExists: boolean, inputUsername: string, inputPassword: string, inputConfirmPassword: string, newPasswordValid:boolean, newUsernameValid:boolean) {
    console.table({userAlreadyExists, inputUsername, inputPassword, inputConfirmPassword, newPasswordValid, newUsernameValid})
    let feedbackMessage: string = "";
    
    if(userAlreadyExists) {
      feedbackMessage = "Username already exists";
    } 
      else if (inputConfirmPassword !== inputPassword) {
      feedbackMessage = "Passwords are not correct";  
    } 
      else if (inputUsername === "" || inputPassword === "" || inputConfirmPassword === "") {
      feedbackMessage = "Please enter all required fields"
    } 
    if(newPasswordValid == false && newUsernameValid == false)
    {
      feedbackMessage = "The Password and the Username doesnt fulfil the requirements.";
    }
    else if(newPasswordValid == false){
      feedbackMessage = "The Password doesnt fulfil the requirements.";
    }
    else if(newUsernameValid == false){
      feedbackMessage = "The Username doesnt fulfil the requirements.";
    }

    this.setState({ feedbackMessage: feedbackMessage });
  }

}

export default withRouter(Register)