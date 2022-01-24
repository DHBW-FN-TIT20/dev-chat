import type { NextPage } from 'next'
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
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
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
              Table
            </div>
            <h1>
              Tickets
            </h1>
            <div> 
              Table
            </div>
          </div>
          <div>
            <img src='logo.png' alt='DEV-CHAT Logo' />
          </div>
        </main>
      </div>
    )
  }
}