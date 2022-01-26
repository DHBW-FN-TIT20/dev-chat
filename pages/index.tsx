import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Main.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'

export interface MainState {
}

export interface MainProps {}

export default class Main extends Component<MainProps, MainState> { 
  constructor(props: MainProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Head>
          <title>Main page</title>
          <meta name="description" content="main page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <div>
            <h1>
              Join Room
            </h1>
            <input type="text" placeholder="Chat-Key..."/>
            <div> 
              Incorrect username or password. 
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
          <div className="image">
            <Image
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
  }
}