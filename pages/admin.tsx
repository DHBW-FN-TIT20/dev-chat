import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Admin.module.css'
import React, { Component } from 'react'
import Header from './header'
import FrontEndController from '../controller/frontEndController'
import { IUser, ISurvey, IBugTicket, IChatKey } from '../public/interfaces'
import chat from './chat'


export interface AdminState {
  isLoggedIn: boolean,
  allUsersState: IUser[],
  allSurveysState: ISurvey[],
  allTicketsState: IBugTicket[],
  allChatKeysState: IChatKey[],
  usernameForSurveys: string[],
  showPopup: boolean,
}

export interface AdminProps extends WithRouterProps {}

/**
 * Component Class for Admin Page
 * @component
 */
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
      showPopup: false,
    }
  }

  /**
   * is always called, if component did mount
   */
  async componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener);
    const tempallUsers = await FrontEndController.getAllUsers();
    this.setState({allUsersState: tempallUsers});
    const tempallSurveys = await FrontEndController.getAllSurveys();
    this.setState({allSurveysState: tempallSurveys});
    const tempallTickets = await FrontEndController.getAllTickets();
    this.setState({allTicketsState: tempallTickets});
    const tempallChatKeys = await FrontEndController.getAllChatKeys();
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
    let currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken) && FrontEndController.getAdminValueFromToken(currentToken)) {
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
  wantedExpirationDate.setHours(wantedExpirationDate.getHours() + 1);
    console.log("wantedExpirationDate: " + wantedExpirationDate);
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.changeChatKeyExpirationDate(currentToken,chatKeyID,wantedExpirationDate);
    if(wasSuccessful){
      console.log("Das expirationDate von Raum Nummer " + chatKeyID + " wurde geändert.");
    }

}

/**
 * This function sets the expiration Time of a survey
 * @param surveyID ID of the survey whose time should be changed
 */
async surveySetTime(surveyID: number | undefined){
  let wantedExpirationDate = new Date((document.getElementById(String(surveyID)) as HTMLInputElement).value);
  wantedExpirationDate.setHours(wantedExpirationDate.getHours() + 1);
    console.log("wantedExpirationDate: " + wantedExpirationDate);
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.changeSurveyExpirationDate(currentToken,surveyID,wantedExpirationDate);
    if(wasSuccessful){
      console.log("Das expirationDate von Survey Nummer " + surveyID + " wurde geändert.");
    }

}

/**
 * This function handles the click of the "Add" Button in the ChatKey Section
 */
async handleAddKeyClick(){
  console.log("ChatKey ist: " + this.inputChatKey);

    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.addCustomChatKey(currentToken, this.inputChatKey);
    if(wasSuccessful){
      console.log("Der Raum: " + this.inputChatKey + " wurde erstellt.");
      location.reload();
      
    }
}

/**
 * This function takes in a bool and prints out the wanted string
 * @param boolToPrint the bool that should be printed
 * @returns {string} either "Done" or "To-Do"
 */
giveBoolStringTicket(boolToPrint: boolean | undefined):string{
  if(boolToPrint){
    return "Done";
  }
  else{
    return "To-Do";
  }
}

/**
 * Same principle as 'giveBoolStringTicket' - gives out String for a bool
 * @param userAccessLevel 
 * @returns {string} either "Admin" or "User"
 */
giveAdminOrUser(userAccessLevel: number | undefined):string{
  if(userAccessLevel === 1){
    return "Admin";
  }
  else{
    return "User";
  }

}

/**
 * Function to handle a click to change the solved State of a ticket
 * @param ticketID ticket that should be changed
 * @param currentState currentState of the ticket (0 or 1)
 * @returns {boolena} true if ticket was changed sucessfully, false if not
 */
async ticketChangeSolvedClick(ticketID: number |undefined, currentState: boolean | undefined ):Promise<boolean>{
  let currentToken = FrontEndController.getUserToken();
  let wasSuccessful = await FrontEndController.changeSolvedState(currentToken,ticketID,currentState);
    
  if(wasSuccessful){
    console.log("Das Ticket mit der Nummer " + ticketID + " wurde auf geändert.");
  }
  else{
    console.log("Es ging beim ändern des Tickets etwas schief.");
  }
  return wasSuccessful;
}

/**
 * This function returns the Username for a certain UserID
 * @param userID 
 * @param username 
 * @param ownerID 
 * @returns {string} username or empty string
 */
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
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.deleteUser(currentToken,name);
    
    if(wasSuccessful){
      console.log("Der User mit dem Namen " + name + " wurde gelöscht.");
    }
  }

  /**
   * This function is used to handle the delete click of a chatKey
   * @param chatID 
   */
  async chatClickDelete(chatID: number | undefined){
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.deleteChatKey(currentToken,chatID);
    
    if(wasSuccessful){
      console.log("Der Chat mit dem Namen " + chatID + " wurde gelöscht.");
    }
  }

  /**
   * This function is used to handle the delet click of a survey
   * @param surveyID 
   */
  async surveyClickDelete(surveyID: number | undefined){
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.deleteSurvey(currentToken,surveyID);
    
    if(wasSuccessful){
      console.log("Die Survey mit der ID " + surveyID + " wurde gelöscht.");
    }
  }

  /**
   * This function is used to promote a certain user, identified by its username
   * @param name 
   */
  async promoteUser(name: string | undefined){
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.promoteUser(currentToken,name);
    if(wasSuccessful){
      console.log("Der User mit dem Namen " + name + " wurde promoted.");
    }
  }

  /**
   * This function is used to demote a certain user, identified by its username
   * @param name 
   */
  async demoteUser(name: string | undefined){
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.demoteUser(currentToken,name);
    if(wasSuccessful){
      console.log("Der User mit dem Namen " + name + " wurde demoted.");
    }
  }

  /**
   * This function is used to reset the password of a certain user, identified by its username
   * @param name 
   */
  async resetPassword(name: string | undefined){
    let currentToken = FrontEndController.getUserToken();
    let wasSuccessful = await FrontEndController.resetPassword(currentToken,name);
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
                            {this.giveAdminOrUser(user.accessLevel)}
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
                          <td><input type="datetime-local" className={styles.inputDate} id={String(ChatKey.id)}/><a href="" onClick={() => this.chatKeySetTime(ChatKey.id)}>Set Time</a></td>
                          <td><a href="" onClick={() => this.chatClickDelete(ChatKey.id)}>Delete</a></td>
                      </tr>
                    ))} 
                    <tr key={this.inputChatKey}>        
                      <td><input 
                        type="text" 
                        placeholder="Custom Chat Key here" 
                        onChange={(event) => {this.inputChatKey = event.target.value}}
                        onKeyPress={(event) => {
                          if (event.key === 'Enter') {
                            this.handleAddKeyClick()
                          }
                        }
                        
                      }/>
                      </td>
                      <td></td>
                      <td></td>
                      <td><a href="" onClick={() => this.handleAddKeyClick()}>Add</a></td>
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
                          <td><input type="datetime-local" className={styles.inputDate} id={String(survey.id)}/><a href="" onClick={() => this.surveySetTime(survey.id)}>Set Time</a></td>
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