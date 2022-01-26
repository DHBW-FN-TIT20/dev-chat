import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Header.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'

export interface HeaderState {
}

export interface HeaderProps {
  pageInformation: string,
  showName: boolean,
}

export default class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Head>
          <title>Header</title>
          <meta name="description" content="header" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <div className={styles.container}>         
          <a href="/">
            <div className={styles.logo}>
              <Image
                src={"/logo.png"}
                alt="DEV-CHAT Logo"
                width={70}
                height={70}
              />
            </div>
          </a>
          <div className={styles.name}>
            {this.props.pageInformation}
          </div>
          
          <div className={styles.space}></div>
          {
            this.props.showName && <div className={styles.user}>Name</div>           
          } 
          
          <a href="">
            <div className={styles.exit}>
              <Image
                src={"/exit.png"}
                alt="DEV-CHAT Exit"
                width={50}
                height={50}
              />
            </div>  
          </a>
          </div>
        </main>
      </div>
    )
  }
}
//<a href="">$</a> 