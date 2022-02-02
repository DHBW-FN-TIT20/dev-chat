import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Password.module.css'
import React, { Component } from 'react'
import Header from './header'
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
  
        <header>
          <Header pageInformation="Change Password" title="Login" showName={true} showExit={true} />
        </header>
        <main>
          <div className={styles.container}>
          <div className={styles.left}>
            <h1>
              Change Password
            </h1>
            <input type="password" placeholder="Old password..."/>
            <input type="password" placeholder="New password..."/>
            <input type="password" placeholder="Confirm new password..."/>
            <div className='error'> 
              Incorrect username or password. 
            </div>
            <button> 
              Log In 
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
}