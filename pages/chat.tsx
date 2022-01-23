import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Chat.module.css'
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
          <title>Chat</title>
          <meta name="description" content="DEV-CHAT" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className={styles.Chat}>
          <div>
            <div className={styles.errorDiv}> 
              Chat here.
            </div>
            <input type="text" placeholder="Write a message..."/>
          </div>
        </main>
      </div>
    )
  }
}