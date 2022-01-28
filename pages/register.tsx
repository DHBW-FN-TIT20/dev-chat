import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'

export interface RegisterState {
  isValid: boolean,
  inputUser: string,
  inputPassword: string,
}

export interface RegisterProps {}

/**
 * @class Class of the register Component
 * @component
 */
export default class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props)
    this.state = {
      isValid: false,
      inputUser: "",
      inputPassword: "",
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
          <title>Register</title>
          <meta name="description" content="register" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <div>
            <h1>
              Create Account
            </h1>
            <input type="text" placeholder="Username..." onChange={(event) => { this.setState({ inputUser: event.currentTarget.value }) }} value={this.state.inputUser} />
            <input type="password" placeholder="Password..." onChange={(event) => { this.setState({ inputPassword: event.currentTarget.value }) }} value={this.state.inputPassword} />
            <input type="password" placeholder="Confirm Password..."/>
            <div> 
              Username already in use. / Passwords are not correct.
            </div>
            <button onClick={async () => {
              this.setState({
                isValid: await DevChatController.verifyUser(this.state.inputUser,this.state.inputPassword)
              })
              DevChatController.userRegisters("", "") // change to state later
            }}> 
              Create
            </button>
            {String(this.state.isValid)}
            {this.state.inputUser}
            <div>
              Or <a href={"/login"}>login</a> instead.
            </div>
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
