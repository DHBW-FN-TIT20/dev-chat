import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import { IChatMessage } from '../public/interfaces'

export interface ChatState {
  input: string,
  messages: IChatMessage[],
}

export interface ChatProps {}

export default class Chat extends Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props)
    this.state = {
      input: '',
      messages: [],
    }
    
  }

  componentDidMount() {
    console.log();

    setInterval(() => this.setState({messages: DevChatController.chatMessages}), 500);
  }

  render() {

    return (
      <div>
        <Head>
          <title>Chat</title>
          <meta name="description" content="chat" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <div>
            <div className={styles.messageTableDiv}> 
              <table>
                <tbody>
                  {this.state.messages.map(message => (
                    <tr key={message.id}>
                      <td>{message.user}</td>
                      <td>at</td>
                      <td>{new Date(message.date).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hourCycle: 'h24',
                          })}</td>
                      <td>-&gt;</td>
                      <td>{message.message}</td>
                    </tr>
                  ))}
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