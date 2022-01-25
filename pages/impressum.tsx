import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/impressum.module.css'
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
          <title>Impressum</title>
          <meta name="Impressum" content="header" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main>
        
        </main>
      </div>
    )
  }
}