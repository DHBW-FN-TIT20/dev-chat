import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'

export interface ChatState {
  chatLineInput: string
}

export interface ChatProps { }

export default class Chat extends Component<ChatProps, ChatState> {
  constructor(props: ChatProps) {
    super(props)
    this.state = {
      chatLineInput: ""
    }

  }

  componentDidMount() {
    console.log();
  }

  ChatList() {  
    console.log("DevChatController.chatMessages: ", DevChatController.chatMessages);
    
    return (
      <ol>
        {DevChatController.chatMessages.map(message => (
          <li key={message.id}>{message.message} {message.user.name}</li>
        ))}
      </ol>
    );
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
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>Henry</td>
                    <td>at</td>
                    <td>15/01/2022 13:46</td>
                    <td>-&gt;</td>
                    <td>Hallo</td>
                  </tr>
                  <tr>
                    <td>Phillipp</td>
                    <td>at</td>
                    <td>15/01/2022 13:48</td>
                    <td>-&gt;</td>
                    <td>Hallo, alles klar?</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <input className={styles.chatBox} value={this.state.chatLineInput} type="text" placeholder="Write a message..." onKeyPress={this.handleEnterKeyPress} onChange={this.handleChatLineInput} />
          </div>
        </main>
      </div>
    )
  }

  /**
  * Handle of the Keypressed-Event from the Input
  * Checks if Enter was pressed
  * @param event Occurred Event
  */
  handleEnterKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      console.log("Entered new Message: " + this.state.chatLineInput);
      DevChatController.enteredNewMessage(this.state.chatLineInput);
      this.setState({ chatLineInput: "" });
    }
  }

  /**
   * Handle of the OnChange-Event from the Input
   * updates the Value of the Input-Line
   * @param event Occured Event
   */
  handleChatLineInput = (event: any) => {
    this.setState({ chatLineInput: event.target.value });
  }
}
