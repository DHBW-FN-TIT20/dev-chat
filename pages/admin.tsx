import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Admin.module.css'
import React, { Component } from 'react'

export interface AdminState {
}

export interface AdminProps {}

export default class Admin extends Component<AdminProps, AdminState> {
  constructor(props: AdminProps) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Head>
          <title>Admin settings</title>
          <meta name='description' content='admin settings' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
  
        <main>
          <div>
            <h1>
              User Settings
            </h1>
            <div> 
              <table>
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
                  <tr>
                    <td>admin</td>
                    <td>ADMIN</td>
                    <td><a href="">Promote</a> | <a href="">Demote</a></td>
                    <td><a href="">Reset</a></td>
                    <td><a href="">Delete</a></td>
                  </tr>
                  <tr>
                    <td>henry</td>
                    <td>USER</td>
                    <td><a href="">Promote</a> | <a href="">Demote</a></td>
                    <td><a href="">Reset</a></td>
                    <td><a href="">Delete</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h1>
              Room Settings
            </h1>
            <div> 
              <table>
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
              <table>
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
              <table>
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
          <div className="image">
            <Image
              priority
              src={"/logo.png"}
              alt="DEV-CHAT Logo"
              width={1000}
              height={1000}
              layout="responsive"
            />
          </div>
        </main>
      </div>
    )
  }
}