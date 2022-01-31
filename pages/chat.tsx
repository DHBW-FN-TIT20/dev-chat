import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'
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
// in chatdiv den chat einfügen, aktuell noch table drin, vllt mit react tabelle ersetzen
// title vllt in raumname ändern
//mit react erkennen welches device!

  render() {



    return (
      <div>
        <Head>
          <title>Chat</title>
          <meta name="description" content="chat" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
        <Header pageInformation="Welcome" title="Chat" showName={true} showExit={true}/>
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
