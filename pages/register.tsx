import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'

export interface RegisterState {
}

export interface RegisterProps {}

export default class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}

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
            <input type="text" placeholder="Username..."/>
            <input type="password" placeholder="Password..."/>
            <input type="password" placeholder="Confirm Password..."/>
            <div> 
              Username already in use. / Passwords are not correct.
            </div>
            <button onClick={() => {
              DevChatController.userRegisters("", "") // change to state later
            }}> 
              Create
            </button>
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