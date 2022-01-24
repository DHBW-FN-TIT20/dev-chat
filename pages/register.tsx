import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
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
          <title>New account</title>
          <meta name="description" content="New Account" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main className={styles.Chat}>
        <div>
            <h1 className={styles.title}>
              Create Account
            </h1>
            <input type="text" placeholder="Username..."/>
            <input type="password" placeholder="Password..."/>
            <input type="password" placeholder="Confirm Password..."/>
            <div className={styles.errorDiv}> 
              Username already in use. / Passwords are not correct.
            </div>
            <button> 
              Create
            </button>
            <div>
              Or <a href={"/login"}>login</a> instead.
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