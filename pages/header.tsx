import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Header.module.css'
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
          <title>Header</title>
          <meta name="description" content="DEV-CHAT-Header" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className={styles.Header}>
            <button>
                Logo
            </button>
            <div>
                DEV-CHAT
            </div>
            <div>
                Room
            </div>
            <div>
                Name
            </div>
            <button>
                Impressum
            </button>
        </main>
      </div>
    )
  }
}