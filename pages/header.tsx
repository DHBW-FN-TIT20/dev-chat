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
  title: string,
  showExit: boolean,
}

export default class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}
// noch ne variable für den header name
  render() {
    return (
      <div>
        <Head>
          <title>{this.props.title}</title>
          <meta name="description" content="header" /> 
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main>
          <div className={styles.container}>         
          <table className={styles.headertable} >
            <tbody>
            <td className={styles.logotd}>
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
          </td>
          <td className={styles.nametd}>
            <div className={styles.name}>
              {this.props.pageInformation}
            </div>
          </td> 
          
          <td className={styles.spacetd}>
            <div className={styles.space}></div>
          </td>
          {
            
            this.props.showName &&
             <td className={styles.usertd}> 
              <div className={styles.user}>User</div>           
            </td>
          } 
          
          <td className={styles.imptd}>
            <a href="">
              <div className={styles.impressum}>
                §
              </div>  
            </a>
          </td>
            {
              this.props.showExit && 
            <td className={styles.exittd}>
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
            </td>
            }
        
          </tbody>
          </table>
          </div>
        </main>
      </div>
    )
  }
}
//<a href="">$</a> 