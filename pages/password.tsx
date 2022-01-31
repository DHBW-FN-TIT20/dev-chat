import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Password.module.css'
import React, { Component } from 'react'

export interface PasswordState {
}

export interface PasswordProps {}

export default class Password extends Component<PasswordProps, PasswordState> {
  constructor(props: PasswordProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Head>
          <title>Change password</title>
          <meta name="description" content="change password" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <div>
            <h1>
              Change Password
            </h1>
            <input type="password" placeholder="Old password..."/>
            <input type="password" placeholder="New password..."/>
            <input type="password" placeholder="Confirm new password..."/>
            <div> 
              Incorrect username or password. 
            </div>
            <button> 
              Log In 
            </button>
          </div>
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
        </main>
      </div>
    )
  }
}