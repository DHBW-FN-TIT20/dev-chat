import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Main.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'
import { getThreeWords } from '../shared/threeword_generator'

export interface MainState {
}

export interface MainProps {}

/**
 * Component-Class for the main Page
 */
export default class Main extends Component<MainProps, MainState> {
  constructor(props: MainProps) {
    super(props)
    this.state = {
    }
  }

  /**
   * is always called, if component did mount
   */
  async componentDidMount() {
    console.log("this.verifyUser() in controller: ", await DevChatController.verifyUser("Johannes", "johannes"));;
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
            <input type="text" placeholder="Chat-Key..." className='input'/>
            <div className='error'> 
              Chat-Key does not exist.
            </div>
            <button onClick={() => {
              // DevChatController.userJoinsRoom(Chat-Key) // method have to be implemented
            }}> 
              Join
            </button>
            <h1>
              Create Room
            </h1>
            <button onClick={() => {
              // DevChatController.userCreatsChatRoom() // method have to be implemented
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
}