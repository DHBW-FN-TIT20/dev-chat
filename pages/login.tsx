import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Login.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'
export interface LoginState {
}

export interface LoginProps {}

/**
 * @class Login Componet Class
 * @component
 */
export default class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
    }
    
  }
  /**
   * is always called, if component did mount
   */
  componentDidMount() {}
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <Head>
          <title>Login</title>
          <meta name="description" content="login page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <Header pageInformation="Welcome" title="Login" showName={false} showExit={false} />
          <div className={styles.left}>
            <div>
              <h1>
                Login
              </h1>
              <div>
              <input type="text" placeholder="Username..."/>
              </div>
              <div>
              <input type="password" placeholder="Password..."/>
              </div>
              <div className='error'> 
                Incorrect username or password. 
              </div>
              <button onClick={() => {
                DevChatController.userLogsIn("", "") // change to state later
              }}> 
                Login 
              </button>
              <div className='create'>
                Or <a href={"/register"}>create Account</a> instead.
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className="image">
              <Image
                src={"/logo.png"}
                alt="DEV-CHAT Logo"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </main>
      </div>
    )
  }
}
