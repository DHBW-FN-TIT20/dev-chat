import withRouter, { WithRouterProps } from 'next/dist/client/with-router'
import React, { Component } from 'react'
import styles from '../styles/Popup.module.css' 
import Image from 'next/image'

export interface HeaderState {
}

export interface HeaderProps extends WithRouterProps {
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

  
    return (
      <div>  
        <main>
          <div className={styles.box}>
	        <a className={styles.button} href="#popup1">Let me Pop up</a>
          </div>

          <div id="popup1" className={styles.overlay}>
	          <div className={styles.popup}>
              <div className={styles.delacc}>
		          <p className={styles.delacchead}>Delete Account</p>
              </div>
              <div className={styles.attentiondiv}>
              <span className={styles.attention}>!</span>
              </div>
		          <div className={styles.content}>
		          	The User "Henry" was succesfully deleted.<br />You will be returned to the login page.
		          </div>
              <div className={styles.button1}>
              <button className='return'>Ok</button>
              </div>
	        </div>
          </div>
        </main>
      </div>
    )
  }
}

export default withRouter(Header)