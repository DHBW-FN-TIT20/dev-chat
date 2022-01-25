import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Header.module.css'
import React, { Component } from 'react'

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
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main>
          <a href="/">
            <img src="logo.png" alt="DEV-CHAT Logo" />
          </a>
          <div>
            DEV-CHAT
          </div>
          <div>
            Name
          </div>
          <a href="">$</a>
          <a href=""><img src="" alt="DEV-CHAT Exit" /></a>
        </main>
      </div>
    )
  }
}