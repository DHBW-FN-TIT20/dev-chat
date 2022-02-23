import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Admin.module.css'
import React, { Component } from 'react'
import Header from './header'
import DevChatController from '../controller'
import { IUser, ISurvey, IBugTicket, IChatKey } from '../public/interfaces'
import Popup from './popup';
import chat from './chat'


export interface AdminState {
  isLoggedIn: boolean,
  allUsersState: IUser[],
  allSurveysState: ISurvey[],
  allTicketsState: IBugTicket[],
  allChatKeysState: IChatKey[],
  usernameForSurveys: string[],
  wantedExpirationDate: Date,
  showPopup: boolean,
}

export interface AdminProps extends WithRouterProps {}

class Admin extends Component<AdminProps, AdminState> {
  inputChatKey = "";
  inputDateCustomChatKey: Date = new Date(0);
  constructor(props: AdminProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      allUsersState: [],
      allSurveysState: [],
      allTicketsState: [],
      allChatKeysState:[],
      usernameForSurveys: [],
      wantedExpirationDate: new Date(0),
      showPopup: false,
    }
  }

  /**
   * is always called, if component did mount
   */
  async componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener);
    const tempallUsers = await DevChatController.getAllUsers();
    this.setState({allUsersState: tempallUsers});
    const tempallSurveys = await DevChatController.getAllSurveys();
    this.setState({allSurveysState: tempallSurveys});
    const tempallTickets = await DevChatController.getAllTickets();
    this.setState({allTicketsState: tempallTickets});
    const tempallChatKeys = await DevChatController.getAllChatKeys();
    this.setState({allChatKeysState: tempallChatKeys});
  }
  
  /**
   * is always called, if component will unmount
   */
  componentWillUnmount() {
    window.removeEventListener('storage', this.storageTokenListener);
  }

  /**
   * This method checks whether the event contains a change in the user-token. If it does, it revalidates the login state.
   * @param {any} event Event triggered by an EventListener
   */
  storageTokenListener = async (event: any) => {
    if (event.key === "DevChat.auth.token") {
      this.checkLoginState();
    }
  }

  /**
   * This method checks and verifys the current user-token. If invalid, it routes to login, if not, the isLoggedIn state is set to true.
   */
  async checkLoginState() {
    let currentToken = DevChatController.getUserToken();
    if (await DevChatController.verifyUserByToken(currentToken) && DevChatController.getAdminValueFromToken(currentToken)) {
      // logged in
      this.setState({isLoggedIn: true})
    } else {
      // not logged in
      const { router } = this.props
      router.push("/login")
    }
  }

/**
 * This function is used to change the expirationDate of a certain ChatKey
 * @param chatKeyID - the ID of the ChatKey that should be altered
 */
async chatKeySetTime(chatKeyID: number | undefined){
  let wantedExpirationDate = new Date((document.getElementById(String(chatKeyID)) as HTMLInputElement).value);
  
    console.log("wantedExpirationDate: " + wantedExpirationDate);
    let currentToken = DevChatController.getUserToken();
   /* let wasSuccessful = await DevChatController.changeChatKeyExpirationDate(currentToken,chatKeyID,wantedExpirationDate);
    if(wasSuccessful){
      console.log("Das expirationDate von Raum Nummer " + chatKeyID + " wurde geändert.");
    }*/

}

handleAddKeyClick(){
  console.log("ChatKey ist: " + this.inputChatKey);
  //let inputValue = (<HTMLInputElement>document.getElementById(elementId)).value;
 
}

giveBoolStringTicket(boolToPrint: boolean | undefined):string{
  if(boolToPrint){
    return "Done";
  }
  else{
    return "To-Do";
  }
}

async ticketChangeSolvedClick(ticketID: number |undefined, currentState: boolean | undefined ):Promise<boolean>{
  let currentToken = DevChatController.getUserToken();
  let wasSuccessful = await DevChatController.changeSolvedState(currentToken,ticketID,currentState);
    
  if(wasSuccessful){
    console.log("Das Ticket mit der Nummer " + ticketID + " wurde auf geändert.");
  }
  else{
    console.log("Es ging beim ändern des Tickets etwas schief.");
  }
  return wasSuccessful;
}

matchingUsername(userID: number | undefined, username: string | undefined, ownerID: number | undefined): string | undefined{
  if(userID === ownerID){
    return username;
  }
  return "";
}

  /**
   * This function is used to delete a user via admin interface
   * @param name username to delete
   */
  async userClickDelete(name: string | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.deleteUser(currentToken,name);
    
    if(wasSuccessful){
      console.log("Der User mit dem Namen " + name + " wurde gelöscht.");
    }
  }

  async chatClickDelete(chatID: number | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.deleteChatKey(currentToken,chatID);
    
    if(wasSuccessful){
      console.log("Der Chat mit dem Namen " + chatID + " wurde gelöscht.");
    }
  }

  async surveyClickDelete(surveyID: number | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.deleteSurvey(currentToken,surveyID);
    
    if(wasSuccessful){
      console.log("Die Survey mit der ID " + surveyID + " wurde gelöscht.");
    }
  }

  async promoteUser(name: string | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.promoteUser(currentToken,name);
    if(wasSuccessful){
      console.log("Der User mit dem Namen " + name + " wurde promoted.");
    }
  }

  async demoteUser(name: string | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.demoteUser(currentToken,name);
    if(wasSuccessful){
      console.log("Der User mit dem Namen " + name + " wurde demoted.");
    }
  }

  async resetPassword(name: string | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.resetPassword(currentToken,name);
    if(wasSuccessful){
      console.log("Das Passwort des Users mit dem Namen " + name + " wurde resettet.");
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {

    const { router } = this.props
    if (this.state.isLoggedIn) {
      return (
        <div>
          <Head>
            <title>Admin settings</title>
            <meta name='description' content='admin settings' />
            <link rel='icon' href='/favicon.ico' />
          </Head>

          <header>
            <Header pageInformation={"Admin"} showName={true} showExit={true} showLogout={false} />
          </header>
    
          <main>
            <div className={styles.container}>
            <div className={styles.left}>
              <h1>
                User Settings
              </h1>                          
              <div> 
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope='col'>Username</th>
                      <th scope='col'>Access Level</th>
                      <th scope='col'>Change Level</th>
                      <th scope='col'>Password</th>
                      <th scope='col'>Account</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.allUsersState.map(user => (
                      <tr key={user.id}>
                          <td>
                          <p>
                            {user.name}
                          </p>
                          </td>

                          <td>
                          <p>
                            {user.accessLevel}
                          </p>
                          </td>
                          <td><a href="" onClick={() => this.promoteUser(user.name)}>Promote</a> | <a href="" onClick={() => this.demoteUser(user.name)}>Demote</a></td>
                          <td><a href="" onClick={() => this.resetPassword(user.name)}>Reset</a></td>
                          <td><a href="" onClick={() => this.userClickDelete(user.name)}>Delete</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h1>
                Room Settings
              </h1>
              <div> 
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope='col'>Key</th>
                      <th scope='col'>Expiration Time</th>
                      <th scope='col'>Change Time</th>
                      <th scope='col'>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.allChatKeysState.map(ChatKey => (
                      <tr key={ChatKey.id}>
                          <td>
                          <p>
                            {ChatKey.threeWord}
                          </p>
                          </td>

                          <td>
                          <p>
                          {new Date(ChatKey.expirationDate).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hourCycle: 'h24',
                            })}
                          </p>
                          </td>
                          <td><a onClick={() => this.chatKeySetTime(ChatKey.id)}><input type="datetime-local" className={styles.inputDate} id={String(ChatKey.id)}/>Set Time</a></td>
                          <td><a href="" onClick={() => this.chatClickDelete(ChatKey.id)}>Delete</a></td>
                      </tr>
                    ))} 
                    <tr key={this.inputChatKey}>        
                      <td><input 
                        type="text" 
                        placeholder="Custom Chat Key here" 
                        onChange={(event) => {this.inputChatKey = event.target.value}}/>
                      </td>
                      <td></td>
                      <td><input type="datetime-local" className={styles.inputDate} id="inputDateTimeCustoml"/></td>
                      <td><a onClick={() => this.handleAddKeyClick()}>Add</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h1>
                Survey Settings
              </h1>
              <div> 
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope='col'>Name</th>
                      <th scope='col'>Expiration Time</th>
                      <th scope='col'>Owner</th>
                      <th scope='col'>Change Time</th>
                      <th scope='col'>Survey</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.allSurveysState.map(survey => (
                      <tr key={survey.id}>
                          <td>
                          <p>
                            {survey.name}
                          </p>
                          </td>
                          <td>
                          <p>
                          {new Date(survey.expirationDate).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hourCycle: 'h24',
                            })}
                          </p>
                          </td>
                          <td>
                          {this.state.allUsersState.map(user => ( 
                            <div key={user.id}>
                                {(this.matchingUsername(user.id,user.name,survey.ownerID))}
                            </div> 
                          ))}
                          </td>
                          <td><a href="">Set Time</a></td>
                          <td><a href="" onClick={() => this.surveyClickDelete(survey.id)}>Delete</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h1>
                Tickets
              </h1>
              <div> 
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope='col'>Submitter</th>
                      <th scope='col'>Created On</th>
                      <th scope='col'>State</th>
                      <th scope='col'>Change State</th>
                      <th scope='col'>Info</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.allTicketsState.map(ticket => (
                      <tr key={ticket.id}>
                          <td>
                          <p>
                            {ticket.submitter}
                          </p>
                          </td>
                          <td>
                          <p>
                          {new Date(ticket.date).toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hourCycle: 'h24',
                            })}
                          </p>
                          </td>
                          <td>
                          <p>
                          {(this.giveBoolStringTicket(ticket.solved))}
                          </p>
                          </td>
                          <td><a href="" onClick={() => this.ticketChangeSolvedClick(ticket.id,ticket.solved)}>Change State</a></td>
                          <td>
                          <p>
                            {ticket.message}
                          </p>
                          </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </main>
        </div>
      )
    } else {
      return (
        <div>
          <Head>
            <title>Admin settings</title>
            <meta name='description' content='admin settings' />
            <link rel='icon' href='/favicon.ico' />
          </Head>
        </div>
      )
    }
  }
}

export default withRouter(Admin)