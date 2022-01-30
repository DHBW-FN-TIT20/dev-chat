import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Header.module.css'
import React, { Component } from 'react'
import DevChatController from '../controller'

export interface HeaderState {
}

export interface HeaderProps {}

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
          <a href="/">
            <div className="image">
              <Image
                src={"/logo.png"}
                alt="DEV-CHAT Logo"
                width={1000}
                height={1000}
                layout="responsive"
              />
            </div>
          </a>
          <div>
            DEV-CHAT
          </div>
          <div>
            Name
          </div>
          <a href="">$</a>
          <a href="">
            <div className="image">
              <Image
                src={"/exit.png"}
                alt="DEV-CHAT Exit"
                width={1000}
                height={1000}
                layout="responsive"
              />
            </div>  
          </a>
        </main>
      </div>
    )
  }
}