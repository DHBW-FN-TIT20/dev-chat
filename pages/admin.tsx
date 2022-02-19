import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Admin.module.css'
import React, { Component } from 'react'
import Header from './header'
import DevChatController from '../controller'
import { IUser } from '../public/interfaces'

export interface AdminState {
  isLoggedIn: boolean,
  allUsersState: IUser[],
}

export interface AdminProps extends WithRouterProps {}

class Admin extends Component<AdminProps, AdminState> {
  constructor(props: AdminProps) {
    super(props)
    this.state = {
      isLoggedIn: false,
      allUsersState: [],
    }
  }

  /**
   * is always called, if component did mount
   */
  async componentDidMount() {
    this.checkLoginState();
    window.addEventListener('storage', this.storageTokenListener);
    const tempallUsers = await this.returnAllUsers();
    this.setState({allUsersState: tempallUsers})
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
   * This method is used to get all Users from the database
   */
  async returnAllUsers(){
    
    let allUsers = await DevChatController.getAllUsers();
    return allUsers;
  }
  async userClickDelete(name: string | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.deleteUser(currentToken,name);
    
    if(wasSuccessful){
      window.alert("Der User mit dem Namen " + name + " wurde gelöscht.");
    }
  }

  async promoteUser(name: string | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.promoteUser(currentToken,name);
    if(wasSuccessful){
      window.alert("Der User mit dem Namen " + name + " wurde promoted.");
    }
  }

  async demoteUser(name: string | undefined){
    let currentToken = DevChatController.getUserToken();
    let wasSuccessful = await DevChatController.demoteUser(currentToken,name);
    if(wasSuccessful){
      window.alert("Der User mit dem Namen " + name + " wurde demoted.");
    }
  }

  async changePassword(name: string | undefined, hashedPassword: string){
    let currentToken = DevChatController.getUserToken();
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
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
                          <td><a href="">Reset</a></td>
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
                    <tr>
                      <td>BreadFatherMother</td>
                      <td>20/01/2021 13:46:14</td>
                      <td><a href="">Set Time</a></td>
                      <td><a href="">Delete</a></td>
                    </tr>
                    <tr>
                      <td><input type="text" placeholder="Enter Custom Key..." /></td>
                      <td>Auto</td>
                      <td><a href="">Set Time</a></td>
                      <td><a href="">Add</a></td>
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
                    <tr>
                      <td>Survey 1</td>
                      <td>16/01/2022 21:23:12</td>
                      <td>admin</td>
                      <td><a href="">Set Time</a></td>
                      <td><a href="">Delete</a></td>
                    </tr>
                    <tr>
                      <td>Survey 2</td>
                      <td>25/01/2022 16:59:59</td>
                      <td>admin</td>
                      <td><a href="">Set Time</a></td>
                      <td><a href="">Delete</a></td>
                    </tr>
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
                    <tr>
                      <td>admin</td>
                      <td>16/01/2022 21:23:12</td>
                      <td>Done</td>
                      <td><a href="">Set To Do</a></td>
                      <td><a href="">View</a></td>
                    </tr>
                    <tr>
                      <td>henry</td>
                      <td>25/01/2022 16:59:59</td>
                      <td>To Do</td>
                      <td><a href="">Set Done</a></td>
                      <td><a href="">View</a></td>
                    </tr>
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