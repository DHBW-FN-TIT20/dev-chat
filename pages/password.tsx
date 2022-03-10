import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Password.module.css'
import React, { Component } from 'react'
import Header from '../components/header'
import FrontEndController from '../controller/frontEndController'
import Popup from '../components/popup';
import { checkPasswordOnRegex } from '../shared/check_password_regex'

export interface PasswordState {
  isLoggedIn: boolean,
  inputOldPassword: string,
  inputNewPassword: string,
  inputConfirmPassword: string,
  feedBackMessage: string,
  oldPasswordIsCorrect: boolean,
  showPopup: boolean,
}

export interface PasswordProps extends WithRouterProps { }

/**
 * Component for the Password Change Page
 * @component
 * @category Pages
 */
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
      showPopup: false,
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
   * @param {any} event Event triggered by an Eventlistener
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
    let currentToken = FrontEndController.getUserToken();
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
   * Checks if Enter was pressed
   * @param {any} event Event triggered by an Eventlistener
   */
  private handleEnterKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      await this.onPasswordChangeButtonClick();
    }
  }

  /**
   * Handle of On click Event from Button
   */
  private onPasswordChangeButtonClick = async () => {
    const { router } = this.props;
    this.setState({ feedBackMessage: "" });
    const oldPasswordIsCorrect = await FrontEndController.changePassword(FrontEndController.getUserToken(), this.state.inputOldPassword, this.state.inputNewPassword);
    this.setState({ oldPasswordIsCorrect: oldPasswordIsCorrect });
    if (oldPasswordIsCorrect) {
      this.togglePopup();
    } else {
      this.updateFeedbackMessage(oldPasswordIsCorrect, this.state.inputOldPassword, this.state.inputNewPassword, this.state.inputConfirmPassword);
      this.setState({
        inputConfirmPassword: "",
        inputOldPassword: "",
        inputNewPassword: "",
      });
    }
  }

  /**
   * This method updates the feedBackMessage which the current user gets during changing password
   * @param {boolean} oldPasswordIsCorrect checks if the old password is correct
   * @param {string} inputOldPassword the input of the old password
   * @param {string} inputNewPassword the input of the new password
   * @param {string} inputConfirmPassword the input of the confirm password
   */
  private updateFeedbackMessage(oldPasswordIsCorrect: boolean, inputOldPassword: string, inputNewPassword: string, inputConfirmPassword: string) {
    console.log("updateFeedbackMessage()");
    console.table({ oldPasswordIsCorrect, inputOldPassword, inputNewPassword, inputConfirmPassword });
    let feedBackMessage: string = "";

    const regexFeedbackMessage: string = checkPasswordOnRegex(inputNewPassword);
    if (regexFeedbackMessage !== "" && inputNewPassword !== "") {
      feedBackMessage = regexFeedbackMessage;
      this.setState({ feedBackMessage: feedBackMessage });
      return;
    }

    if (!oldPasswordIsCorrect) {
      feedBackMessage = "Old password is incorrect or the new password doesn't match the requirements";
    }

    if (inputOldPassword === inputNewPassword) {
      feedBackMessage = "Old password cannot be new password";
    }
    else if (inputConfirmPassword !== inputNewPassword) {
      feedBackMessage = "Passwords are not correct";
    }
    else if (inputOldPassword === "" || inputNewPassword === "" || inputConfirmPassword === "") {
      feedBackMessage = "Please enter all required fields";
    }

    this.setState({ feedBackMessage: feedBackMessage });
  }

  /**
   * Function which toogles the PopUp
   */
  private togglePopup() {
    if (this.state.showPopup == true) {
      const { router } = this.props;
      router.push("/");
      this.setState({ showPopup: !this.state.showPopup });
    } else {
      this.setState({ showPopup: !this.state.showPopup });
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
                    this.setState({ inputOldPassword: event.currentTarget.value })
                    this.updateFeedbackMessage(this.state.oldPasswordIsCorrect, event.currentTarget.value, this.state.inputNewPassword, this.state.inputConfirmPassword);
                  }}
                  onKeyPress={this.handleEnterKeyPress}
                  value={this.state.inputOldPassword} />
                <input type="password" placeholder="New Password..."
                  onChange={(event) => {
                    this.setState({ inputNewPassword: event.currentTarget.value })
                    this.updateFeedbackMessage(this.state.oldPasswordIsCorrect, this.state.inputOldPassword, event.currentTarget.value, this.state.inputConfirmPassword);
                  }}
                  onKeyPress={this.handleEnterKeyPress}
                  value={this.state.inputNewPassword} />
                <input type="password" placeholder="Confirm New Password..."
                  onChange={(event) => {
                    this.setState({ inputConfirmPassword: event.currentTarget.value })
                    this.updateFeedbackMessage(this.state.oldPasswordIsCorrect, this.state.inputOldPassword, this.state.inputNewPassword, event.currentTarget.value);
                  }}
                  onKeyPress={this.handleEnterKeyPress}
                  value={this.state.inputConfirmPassword} />
                <div className='error' hidden={this.state.feedBackMessage === ""}>
                  <p>
                    {this.state.feedBackMessage}
                  </p>
                </div>
                <button onClick={this.onPasswordChangeButtonClick}> Change Password </button>
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
            {this.state.showPopup ?
              <Popup
                headerText='Change Password'
                textDisplay='The Password was changed successfully.'
                closePopup={this.togglePopup.bind(this)}
              />
              : null
            }
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