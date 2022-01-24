import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Password.module.css'
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
          <title>Password reset</title>
          <meta name="description" content="Change Password" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main className={styles.Login}>
          <div>
            <h1 className={styles.title}>
              Change Password
            </h1>
            <input type="password" placeholder="Old password..."/>
            <input type="password" placeholder="New password..."/>
            <input type="password" placeholder="Confirm new password..."/>
            <div className="error"> 
              Incorrect username or password. 
            </div>
            <button> 
              Log In 
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