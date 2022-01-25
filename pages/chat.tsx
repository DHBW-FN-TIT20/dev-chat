import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'

export interface ChatState {
}

export interface ChatProps {}

export default class Chat extends Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Head>
          <title>Chat</title>
          <meta name="description" content="chat" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main>
          <div>
            <div> 
              <table>
                <tbody>
                  <tr>
                    <td>Henry</td>
                    <td>at 15/01/2022 13:46 -> </td>
                    <td>Hallo</td>
                  </tr>
                  <tr>
                    <td>Phillipp</td>
                    <td>at 15/01/2022 13:48 -> </td>
                    <td>Hallo, alles klar?</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <input className={styles.chatBox} type="text" placeholder="Write a message..."/>
          </div>
        </main>
      </div>
    )
  }
}