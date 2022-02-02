import Head from 'next/head'
import styles from '../styles/Chat.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'
import Header from './header'
import { IChatMessage } from '../public/interfaces'

export interface ChatState {
  chatLineInput: string,
  messages: IChatMessage[],
}

export interface ChatProps { }

export default class Chat extends Component<ChatProps, ChatState> {
  private messageFetchInterval: any = undefined;
  constructor(props: ChatProps) {
    super(props)
    this.state = {
      chatLineInput: '',
      messages: [],
    }
  }

  componentDidMount() {
    console.log();
    DevChatController.startMessageFetch();
    this.messageFetchInterval = setInterval(() => {
      this.setState({messages: DevChatController.chatMessages})
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.messageFetchInterval);
    DevChatController.stopMessageFetch();
  }

  render() {

    return (
      <div>
        <Head>
          <title>Chat</title>
          <meta name="description" content="chat" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <Header pageInformation={"chatKey"} showName={true} title={"Chat"} showExit={true} />
        </header>

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
      DevChatController.addChatMessage(this.state.chatLineInput, "Johannes", "FatherMotherBread");
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
