import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Main.module.css'
import React, { Component } from 'react'
import Header from './header'
import DevChatController from '../controller'

export interface MainState {
  inputChatKey: string,
  feedbackMessage: string,
  doesChatKeyExists: boolean,
}

export interface MainProps {}

/**
 * Component-Class for the main Page
 */
export default class Main extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props)
    this.state = {
      inputChatKey: "",
      feedbackMessage: "",
      doesChatKeyExists: false
    }
  }

  /**
   * is always called, if component did mount
   */
  async componentDidMount() {
   // console.log("this.verifyUser() in controller: ", await DevChatController.verifyUser("Johannes", "johannes"));;
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <Head>
          <title>Main page</title>
          <meta name="description" content="main page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
        <Header pageInformation="MAIN MENU" title="Rooms" showName={true} showExit={true} />
        <div className={styles.container}>
          <div className={styles.left}>
            <h1>
              Join Room
            </h1>
            <input type="text" placeholder="Chat-Key..." className='input' 
              onChange={(event) => { 
                this.setState({ inputChatKey: event.currentTarget.value})       
              }} 
            value={this.state.inputChatKey} />           
            <div className='error' hidden={this.state.feedbackMessage === ""}>{this.state.feedbackMessage}</div>

            <button onClick={async() => {
              let doesChatKeyExists = await DevChatController.doesChatKeyExists(this.state.inputChatKey)
              this.setState({
                doesChatKeyExists: doesChatKeyExists
              })
              if(this.state.doesChatKeyExists)
              {
                console.log("EXISTS")
                //Routing
              }
              else {
                console.log("NOT EXISTS")
              }
              this.updateFeedbackMessage(this.state.doesChatKeyExists);        
            }}> 
              Join
            </button>
            <h1>
              Create Room
            </h1>
            <button onClick={() => {
              DevChatController.CreateChatRoom();
              //Danach weiterleiten zum Chat
            }}> 
              Create
            </button>
            <h1>
              Settings
            </h1>
            <button> 
              Admin Settings
            </button>
            <button> 
              Change Password
            </button>
            <button> 
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
  }
  private updateFeedbackMessage(doesChatKeyExists: boolean) {
    console.log("updateFeedbackMessage()");
    let feedbackMessage: string = "";
    
    if(!doesChatKeyExists) {
      feedbackMessage = "Chat-Key does not exists";
    } 

    this.setState({ feedbackMessage: feedbackMessage });
  }
}