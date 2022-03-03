import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import styles from '../styles/Admin.module.css'
import React, { Component } from 'react'
import Header from '../components/header'
import FrontEndController from '../controller/frontEndController'
import { IUser, ISurvey, IBugTicket, IChatKey } from '../public/interfaces'
import { AccessLevel } from '../enums/accessLevel'


export interface AdminState {
  isLoggedIn: boolean;
  allUsersState: IUser[];
  allSurveysState: ISurvey[];
  allTicketsState: IBugTicket[];
  allChatKeysState: IChatKey[];
  usernameForSurveys: string[];
}

export interface AdminProps extends WithRouterProps { }

/**
 * @category Page
 */
class Admin extends Component<AdminProps, AdminState> {
  private inputChatKey = "";
  constructor(props: AdminProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      allUsersState: [],
      allSurveysState: [],
      allTicketsState: [],
      allChatKeysState: [],
      usernameForSurveys: [],
    }
  }

  /**
   * is always called, if component did mount
   */
  async componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener);

    const tempAllUsers = await FrontEndController.getAllUsers();
    this.setState({ allUsersState: tempAllUsers });
    const tempAllSurveys = await FrontEndController.getAllSurveys();
    this.setState({ allSurveysState: tempAllSurveys });
    const tempAllTickets = await FrontEndController.getAllTickets();
    this.setState({ allTicketsState: tempAllTickets });
    const tempAllChatKeys = await FrontEndController.getAllChatKeys();
    this.setState({ allChatKeysState: tempAllChatKeys });
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
  private storageTokenListener = async (event: any) => {
    if (event.key === "DevChat.auth.token") {
      this.checkLoginState();
    }
  }

  /**
   * This method checks and verifys the current user-token. If invalid, it routes to login, if not, the isLoggedIn state is set to true.
   */
  private async checkLoginState() {
    const currentToken = FrontEndController.getUserToken();
    if (await FrontEndController.verifyUserByToken(currentToken) && FrontEndController.getAdminValueFromToken(currentToken)) {
      // logged in
      this.setState({ isLoggedIn: true });
    } else {
      // not logged in
      const { router } = this.props;
      router.push("/login");
    }
  }

  /**
   * This function is used to change the expirationDate of a certain ChatKey
   * @param chatKeyID - the ID of the ChatKey that should be altered
   */
  private async chatKeySetTime(chatKeyID: number) {
    const wantedExpirationDate = new Date((document.getElementById("ChatKey" + String(chatKeyID)) as HTMLInputElement).value);
    wantedExpirationDate.setHours(wantedExpirationDate.getHours() + 1);

    console.log("wantedExpirationDate: " + wantedExpirationDate);

    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.changeChatKeyExpirationDate(currentToken, chatKeyID, wantedExpirationDate);

    if (wasSuccessful) {
      console.log("Das expirationDate von Raum Nummer " + chatKeyID + " wurde geändert.");
      const tempAllChatKeys = await FrontEndController.getAllChatKeys();
      this.setState({ allChatKeysState: tempAllChatKeys });
    }
  }

  /**
   * This function sets the expiration Time of a survey
   * @param surveyID ID of the survey whose time should be changed
   */
  private async surveySetTime(surveyID: number) {
    const wantedExpirationDate = new Date((document.getElementById("Survey" + String(surveyID)) as HTMLInputElement).value);
    wantedExpirationDate.setHours(wantedExpirationDate.getHours() + 1);

    console.log("wantedExpirationDate: " + wantedExpirationDate);

    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.changeSurveyExpirationDate(currentToken, surveyID, wantedExpirationDate);

    if (wasSuccessful) {
      console.log("Das expirationDate von Survey Nummer " + surveyID + " wurde geändert.");
      const tempAllSurveys = await FrontEndController.getAllSurveys();
      this.setState({ allSurveysState: tempAllSurveys });
    }
  }

  /**
   * This function handles the click of the "Add" Button in the ChatKey Section
   */
  private handleAddKeyClick = async () => {
    console.log("ChatKey ist: " + this.inputChatKey);

    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.addCustomChatKey(currentToken, this.inputChatKey);

    this.inputChatKey = "";
    (document.getElementById("inputAddCustomChatKey") as HTMLInputElement).value = "";

    if (wasSuccessful) {
      console.log("Der Raum: " + this.inputChatKey + " wurde erstellt.");
      const tempAllChatKeys = await FrontEndController.getAllChatKeys();
      this.setState({ allChatKeysState: tempAllChatKeys });
    }
  }

  /**
   * This function takes in a bool and returns the wanted string (+ adds coloring to <p> tag)
   * @param boolToPrint the bool that should be printed
   * @returns string, either "Done" or "To-Do"
   */
  private giveBoolStringTicket(boolToPrint: boolean, ticketID: number): string {
    const elem: HTMLElement | null = document.getElementById("Ticket" + String(ticketID));
    if (boolToPrint) {
      elem?.classList.add("green");
      return "Done";
    } else {
      elem?.classList.add("orange");
      return "To-Do";
    }
  }

  /**
   * This funcitons returns the string value of AccessLevel
   * @returns AccessLevel as string
   */
  private giveAdminOrUser(userAccessLevel: AccessLevel): string {
    if (userAccessLevel === AccessLevel.ADMIN) {
      return "Admin";
    }
    else if (userAccessLevel === AccessLevel.USER) {
      return "User";
    }
    return "";
  }

  /**
   * Function to change the solved State of a ticket
   * @param ticketID ticket that should be changed
   * @param currentState currentState of the ticket (true or false)
   * @returns true if change was successfull, false if not
   */
  private async ticketChangeSolvedClick(ticketID: number, currentState: boolean): Promise<boolean> {
    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.changeSolvedState(currentToken, ticketID, currentState);

    if (wasSuccessful) {
      console.log("Das Ticket mit der Nummer " + ticketID + " wurde auf " + currentState ? "To-Do" : "Done" + " geändert.");
      const tempAllTickets = await FrontEndController.getAllTickets();
      this.setState({ allTicketsState: tempAllTickets });  
    } else {
      console.log("Beim ändern des Tickets ging etwas schief.");
    }
    return wasSuccessful;
  }

  /**
   * This function returns the given username if UserID-OwnerID match
   */
  private matchingUsername(userID: number, username: string, ownerID: number): string {
    if (userID === ownerID) {
      return username;
    }
    return "";
  }

  /**
   * This function is used to delete a user via admin interface
   */
  private async userClickDelete(name: string) {
    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.deleteUser(currentToken, name);

    if (wasSuccessful) {
      console.log("Der User mit dem Namen " + name + " wurde gelöscht.");
      const tempAllUsers = await FrontEndController.getAllUsers();
      this.setState({ allUsersState: tempAllUsers });
    }
  }

  /**
   * This function is used to handle the delete click of a chatKey
   */
  private async chatClickDelete(chatID: number) {
    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.deleteChatKey(currentToken, chatID);

    if (wasSuccessful) {
      console.log("Der Chat mit dem Namen " + chatID + " wurde gelöscht.");
      const tempAllChatKeys = await FrontEndController.getAllChatKeys();
      this.setState({ allChatKeysState: tempAllChatKeys });
    }
  }

  /**
   * This function is used to handle the delet click of a survey
   */
  private async surveyClickDelete(surveyID: number) {
    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.deleteSurvey(currentToken, surveyID);

    if (wasSuccessful) {
      console.log("Die Survey mit der ID " + surveyID + " wurde gelöscht.");
      const tempAllSurveys = await FrontEndController.getAllSurveys();
      this.setState({ allSurveysState: tempAllSurveys });
    }
  }

  /**
   * This function is used to promote a certain user, identified by its username
   */
  private async promoteUser(name: string) {
    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.promoteUser(currentToken, name);

    if (wasSuccessful) {
      console.log("Der User mit dem Namen " + name + " wurde promoted.");
      const tempAllUsers = await FrontEndController.getAllUsers();
      this.setState({ allUsersState: tempAllUsers });
    }
  }

  /**
   * This function is used to demote a certain user, identified by its username
   */
  private async demoteUser(name: string) {
    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.demoteUser(currentToken, name);

    if (wasSuccessful) {
      console.log("Der User mit dem Namen " + name + " wurde demoted.");
      const tempAllUsers = await FrontEndController.getAllUsers();
      this.setState({ allUsersState: tempAllUsers });
    }
  }

  /**
   * This function is used to reset the password of a certain user, identified by its username
   */
  private async resetPassword(name: string) {
    const currentToken = FrontEndController.getUserToken();
    const wasSuccessful = await FrontEndController.resetPassword(currentToken, name);
    if (wasSuccessful) {
      console.log("Das Passwort des Users mit dem Namen " + name + " wurde resettet.");
      const tempAllUsers = await FrontEndController.getAllUsers();
      this.setState({ allUsersState: tempAllUsers });
    }
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props;

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
                            <p className='red'>
                              {this.giveAdminOrUser(user.accessLevel)}
                            </p>
                          </td>
                          <td>
                            <a onClick={() => this.promoteUser(user.name)}>
                              Promote
                            </a>
                            &nbsp;|&nbsp;
                            <a onClick={() => this.demoteUser(user.name)}>
                              Demote
                            </a>
                          </td>
                          <td>
                            <a onClick={() => this.resetPassword(user.name)}>
                              Reset
                            </a>
                          </td>
                          <td>
                            <a onClick={() => this.userClickDelete(user.name)}>
                              Delete
                            </a>
                          </td>
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
                              {ChatKey.keyword}
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
                          <td>
                            <input type="datetime-local" className={styles.inputDate} id={"ChatKey" + String(ChatKey.id)} />
                            <a onClick={() => this.chatKeySetTime(ChatKey.id)}>
                              Set Time
                            </a>
                          </td>
                          <td>
                            <a onClick={() => this.chatClickDelete(ChatKey.id)}>
                              Delete
                            </a>
                          </td>
                        </tr>
                      ))}
                      <tr key={this.inputChatKey}>
                        <td>
                          <input
                            id="inputAddCustomChatKey"
                            type="text"
                            placeholder="Custom Chat Key here"
                            onChange={(event) => { this.inputChatKey = event.target.value }}
                            onKeyPress={(event) => {
                              if (event.key === 'Enter') {
                                this.handleAddKeyClick()
                              }
                            }
                            }
                          />
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                          <a onClick={() => this.handleAddKeyClick()}>
                            Add
                          </a>
                        </td>
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
                        <th scope='col'>ID</th>
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
                              {survey.id}
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
                                {(this.matchingUsername(user.id, user.name, survey.ownerID))}
                              </div>
                            ))}
                          </td>
                          <td>
                            <input type="datetime-local" className={styles.inputDate} id={"Survey" + String(survey.id)} />
                            <a onClick={() => this.surveySetTime(survey.id)}>
                              Set Time
                            </a>
                          </td>
                          <td>
                            <a onClick={() => this.surveyClickDelete(survey.id)}>
                              Delete
                            </a>
                          </td>
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
                              {this.state.allUsersState.find(user => user.id === ticket.submitterID)?.name}
                            </p>
                          </td>
                          <td>
                            <p>
                              {new Date(ticket.createDate).toLocaleDateString('de-DE', {
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
                            <p id={"Ticket" + String(ticket.id)}>
                              {(this.giveBoolStringTicket(ticket.solved, ticket.id))}
                            </p>
                          </td>
                          <td>
                            <a onClick={() => this.ticketChangeSolvedClick(ticket.id, ticket.solved)}>
                              Change State
                            </a>
                          </td>
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