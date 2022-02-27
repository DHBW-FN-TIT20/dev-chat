import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Header.module.css'
import React, { Component } from 'react'
import FrontEndController from '../controller/frontEndController'

export interface HeaderState {
}

export interface HeaderProps extends WithRouterProps {
  pageInformation: string,
  showName: boolean,
  showExit: boolean,
  showLogout: boolean,
}

class Header extends Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props)
    this.state = {
    }
    
  }

  componentDidMount() {}
// noch ne variable für den header name
  
  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    /**
     * Initialize Router to navigate to other pages
     */
    const { router } = this.props

    let showName = <></>

    if (this.props.showName) {
      showName = <td className={styles.usertd}> 
                  <div className={styles.user}>
                    { FrontEndController.getUserFromToken(FrontEndController.getUserToken()) }
                  </div>           
                </td>
    }

    let showExit = <></>

    if (this.props.showExit) {
      showExit = <td className={styles.exittd + " clickable"}>
                  <div className={styles.exit}>
                    <Image
                      src={"/exit.png"}
                      alt="DEV-CHAT Exit"
                      width={50}
                      height={50}
                      onClick={() => router.push("/")}
                    />
                  </div>
                </td>
    }

    let showLogout = <></>

    if (this.props.showLogout) {
      showLogout = <td className={styles.exittd + " clickable"}>
                    <div className={styles.exit}>
                      <Image
                        src={"/exit.png"}
                        alt="DEV-CHAT Exit"
                        width={50}
                        height={50}
                        onClick={() => {
                          FrontEndController.logoutUser();
                          router.reload();
                        }}
                      />
                    </div>
                  </td>
    }

    return (
      <div>  
        <main>
          <div className={styles.container}>         
            <table className={styles.headertable} >
              <tbody>
                <tr>
                  <td className={styles.logotd + " clickable"}>
                    <div className={styles.logo}>
                      <Image
                        priority
                        src={"/logo.png"}
                        alt="DEV-CHAT Logo"
                        width={70}
                        height={70}
                        onClick={() => router.push("/")}
                      />
                    </div>
                  </td>
                  <td className={styles.nametd}>
                    <div className={styles.name}>
                      {this.props.pageInformation}
                    </div>
                  </td> 
              
                  <td className={styles.spacetd}>
                    <div className={styles.space}></div>
                  </td>
                  { showName }
                  <td className={styles.imptd + " clickable"}>
                    <div 
                      className={styles.impressum}
                      onClick={() => router.push("/impressum")} >
                      §
                    </div>  
                  </td>
                  { showExit }
                  { showLogout }
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    )
  }
}

export default withRouter(Header)