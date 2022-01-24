import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
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
          <title>Log In</title>
          <meta name="description" content="Log In page" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main className={styles.Login}>
          <div>
            <h1 className={styles.title}>
              Log In
            </h1>
            <input type="text" placeholder="Username..."/>
            <input type="password" placeholder="Password..."/>
            <div className={styles.errorDiv}> 
              Incorrect username or password. 
            </div>
            <button> 
              Log In 
            </button>
            <div>
              Or <a href={"/register"}>create Account</a> instead.
            </div>
          </div>
          <div>
            <img src="logo.png" alt="DEV-CHAT Logo" />
          </div>
        </main>
      </div>
    )
  }
}