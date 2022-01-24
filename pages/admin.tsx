import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Admin.module.css'
import React, { Component } from 'react'

export interface LoginState {
}

export interface LoginProps {}

export default class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Admin settings</title>
          <meta name='description' content='Admin settings' />
          <link rel='icon' href='/favicon.ico' />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main className={styles.Main}>
          <div>
              <h1 className={styles.title}>
                User Settings
              </h1>
              <div className={styles.errorDiv}> 
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.col12}>
                        <table className='table table-bordered'>
                            <thead>
                            <tr>
                                <th scope='col'>Day</th>
                                <th scope='col'>Article Name</th>
                                <th scope='col'>Author</th>
                                <th scope='col'>Shares</th>
                                <th scope='col'>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope='row'>1</th>
                                <td>Bootstrap 4 CDN and Starter Template</td>
                                <td>Cristina</td>
                                <td>2.846</td>
                                <td>
                                <button type='button' className='btn btn-primary'><i className='b1'></i></button>
                                <button type='button' className='btn btn-success'><i className='b2'></i></button>
                                <button type='button' className='btn btn-danger'><i className='b3'></i></button>
                                </td>
                            </tr>
                            <tr>
                                <th scope='row'>2</th>
                                <td>Bootstrap Grid 4 Tutorial and Examples</td>
                                <td>Cristina</td>
                                <td>3.417</td>
                                <td>
                                <button type='button' className='btn btn-primary'><i className='far fa-eye'></i></button>
                                <button type='button' className='btn btn-success'><i className='fas fa-edit'></i></button>
                                <button type='button' className='btn btn-danger'><i className='far fa-trash-alt'></i></button>
                                </td>
                            </tr>
                            <tr>
                                <th scope='row'>3</th>
                                <td>Bootstrap Flexbox Tutorial and Examples</td>
                                <td>Cristina</td>
                                <td>1.234</td>
                                <td>
                                <button type='button' className='btn btn-primary'><i className='far fa-eye'></i></button>
                                <button type='button' className='btn btn-success'><i className='fas fa-edit'></i></button>
                                <button type='button' className='btn btn-danger'><i className='far fa-trash-alt'></i></button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
              </div>
              <h1 className={styles.title}>
                Room Settings
              </h1>
              <div className={styles.errorDiv}> 
                Table
              </div>
              <h1 className={styles.title}>
                Survey Settings
              </h1>
              <div className={styles.errorDiv}> 
                Table
              </div>
              <h1 className={styles.title}>
                Tickets
              </h1>
              <div className={styles.errorDiv}> 
                Table
              </div>
          </div>
          <div>
            <img src='logo.png' alt='styles.DEV-CHAT Logo' />
          </div>
        </main>
      </div>
    )
  }
}