import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'

export interface RegisterState {
  userAlreadyExists: boolean,
  inputUsername: string,
  inputPassword: string,
  inputConfirmPassword: string,
  feedbackMessage: string,
}

export interface RegisterProps {}

/**
 * @class Class of the register Component
 * @component
 */
export default class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props)
    this.state = {
      userAlreadyExists: false,
      inputUsername: "",
      inputPassword: "",
      inputConfirmPassword: "",
      feedbackMessage: "",
    }
    
  }
  /**
   * is always called, if component did mount
   */
  componentDidMount() {}
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <Head>
          <title>Register</title>
          <meta name="description" content="register" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header pageInformation="Welcome" title="Register" showName={false} showExit={false} />
        </header>
        <main>
          <div className={styles.container}>
          <div className={styles.left}>
            <h1>
              Create Account
            </h1>
            <input type="text" placeholder="Username..." 
              onChange={(event) => { 
                this.setState({ inputUsername: event.currentTarget.value, userAlreadyExists: false}) 
                this.updateFeedbackMessage(false, event.currentTarget.value, this.state.inputPassword, this.state.inputConfirmPassword); 
              }} 
              value={this.state.inputUsername} />
            <input type="password" placeholder="Password..." 
              onChange={(event) => { 
                this.setState({ inputPassword: event.currentTarget.value }) 
                this.updateFeedbackMessage(this.state.userAlreadyExists, this.state.inputUsername, event.currentTarget.value, this.state.inputConfirmPassword); 
              }} 
              value={this.state.inputPassword} />
            <input type="password" placeholder="Confirm Password..." 
              onChange={(event) => { 
                this.setState({ inputConfirmPassword: event.currentTarget.value }) 
                this.updateFeedbackMessage(this.state.userAlreadyExists, this.state.inputUsername, this.state.inputPassword, event.currentTarget.value);
              }} 
              value={this.state.inputConfirmPassword}/>
            
            <div className='error' hidden={this.state.feedbackMessage === ""}>{this.state.feedbackMessage}</div>

            <button onClick={async () => {
              let userAlreadyExists = await DevChatController.userAlreadyExists(this.state.inputUsername)
              this.setState({
                 userAlreadyExists: userAlreadyExists
              })
              //this.state.inputPassword === "" && this.state.inputConfirmPassword === "" && this.state.inputUsername === "" || this.state.inputConfirmPassword !== this.state.inputPassword
              //Hier muss Lukas noch die Anforderungen dann einbauen
              if(!this.state.userAlreadyExists && this.state.inputConfirmPassword === this.state.inputPassword) {
                console.log("Pressed Register Button" )
                DevChatController.userRegisters(this.state.inputUsername, this.state.inputPassword)
              }
              this.updateFeedbackMessage(userAlreadyExists, this.state.inputUsername, this.state.inputPassword, this.state.inputConfirmPassword);
            }}> 
              Create
            </button>
            <div>
              Or <a href={"/login"}>login</a> instead.
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
          </div>
        </main>
      </div>
    )
  }


  private updateFeedbackMessage(userAlreadyExists: boolean, inputUser: string, inputPassword: string, inputConfirmPassword: string) {
    console.log("updateFeedbackMessage()");
    console.table({userAlreadyExists, inputUser, inputPassword, inputConfirmPassword})
    let feedbackMessage: string = "";
    
    if(userAlreadyExists) {
      feedbackMessage = "Username already exists";
    } 
      else if (inputConfirmPassword !== inputPassword) {
      feedbackMessage = "Passwords are not correct";  
    } 
      else if (inputUser === "" || inputPassword === "" || inputConfirmPassword === "") {
      feedbackMessage = "Please enter all required fields"
    } 

    this.setState({ feedbackMessage: feedbackMessage });
  }

}
