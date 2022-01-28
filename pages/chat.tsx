import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'
export interface ChatState {
  input: string
}

export interface ChatProps {}

export default class Chat extends Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props)
    this.state = {
      input: ''
    }
    
  }

  componentDidMount() {
    console.log();
  }
// in chatdiv den chat einfügen, aktuell noch table drin, vllt mit react tabelle ersetzen
  render() {
    return (
      <div>
        <Head>
          <title>Chat</title>
          <meta name="description" content="chat" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
        <Header pageInformation="Welcome" title="Login" showName={true} showExit={true} />
          <div>
            <div className={styles.chatdiv}> 
              <table className={styles.chattable}>
                <tbody>
                  <tr className={styles.td}>
                    <td className={styles.td}>Henry</td>
                    <td className={styles.td}>at</td>
                    <td className={styles.td}>15/01/2022 13:46</td>
                    <td className={styles.td}>-&gt;</td>
                    <td className={styles.td}>Hallo</td>
                  </tr>
                  <tr className={styles.td}>
                    <td className={styles.td}>Phillipp</td>
                    <td className={styles.td}>at</td>
                    <td className={styles.td}>15/01/2022 13:48</td>
                    <td className={styles.td}>-&gt;</td>
                    <td className={styles.td}>Hallo, alles klar?</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <input className={styles.chatBox} type="text" onChange={(event) => {this.setState({input: event.target.value})}} placeholder="Write a message..." onKeyDownCapture={(event) => {
              
              // this is a example how to use the controller
              // the UI-things (here: clear the message after enter) have to be done in this file
              // the logic-things have to be done in the controller
              // therefore just call the controller and pass arguments (here: the input string) 
              
              if (event.key === 'Enter') {
                console.log("this.state.input: " + this.state.input)
                DevChatController.enteredNewMessage(this.state.input); // logic
                this.setState({input: ''});                             // UI
              }
            }}/>
          </div>
        </main>
      </div>
    )
  }
}