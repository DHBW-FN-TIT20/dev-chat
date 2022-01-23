import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Main.module.css'
import React, { Component } from 'react'

export interface LoginState {
}

export interface LoginProps {}

export default class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Main page</title>
          <meta name="description" content="Main page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className={styles.Main}>
          <div>
              <h1 className={styles.title}>
                Join Room
              </h1>
              <input type="text" placeholder="Chat-Key..."/>
              <div className={styles.errorDiv}> 
              Incorrect username or password. 
              </div>
              <button> 
                Join
              </button>
              <h1 className={styles.title}>
                Create Room
              </h1>
              <button> 
                Create
              </button>
              <h1 className={styles.title}>
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
          <div>
            <img src="logo.png" alt="DEV-CHAT Logo" />
          </div>
        </main>
      </div>
    )
  }
}