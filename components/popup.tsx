import React, { Component } from 'react'
import styles from '../styles/Popup.module.css'

export interface PopupState {
}

export interface PopupProps {
  headerText: string,
  textDisplay: string,
  closePopup: undefined,
}

/**
 * Component-Class for the Popup
 */
export class Popup extends Component<PopupProps, PopupState> {
  render() {
    // console.log(this.props.closePopup);
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <div className={styles.delacc}>
            <p className={styles.delacchead}>{this.props.headerText}</p>
          </div>
          <div className={styles.attentiondiv}>
            <span className={styles.attention}>!</span>
          </div>
          <div className={styles.content}>
            {this.props.textDisplay}
          </div>
          <div className={styles.button1}>
            <button className={styles.buttonPopup} onClick={this.props.closePopup}>Ok</button>
          </div>
        </div>
      </div>
    );
  }
}