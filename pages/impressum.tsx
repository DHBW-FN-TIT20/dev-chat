import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/impressum.module.css'
import React, { Component } from 'react'

export interface ImpressumState {
}

export interface ImpressumProps {}

export default class Impressum extends Component<ImpressumProps, ImpressumState> {
  constructor(props: ImpressumProps) {
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
          <meta name="Impressum" content="impressum" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800&display=swap" />
        </Head>
  
        <main>
          <div>
            <h1>
              Verantwortlich
            </h1>
            <p>
              Henry Schuler
            </p>
            <h1>
              Team
            </h1>
            <p>
              Nico Bayer <br />
              Johannes Brandenburger <br />
              Lukas Braun <br />
              Jan Brutscher <br />
              Phillipp Patzelt <br />
            </p>
            <h1>
              Kontakt
            </h1>
            <p>
              DEV-CHAT <br />
              STRASSE <br />
              PLZ ORT <br />
              <br />
              TELEFON <br />
              E-MAIL <br />
            </p>
          </div>
          <div>
            <img src="logo.png" alt="DEV-CHAT Logo" />
          </div>
        </main>
      </div>
    )
  }
}