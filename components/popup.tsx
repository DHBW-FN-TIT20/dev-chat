import React, { Component } from 'react'
import styles from '../styles/Popup.module.css'

export interface PopupState {
}

export interface PopupProps {
  headerText: string;
  textDisplay: string;
  closePopup: any;
}

/**
 * Component-Class for the Popup
 * @component
 * @category Component
 */
class Popup extends Component<PopupProps, PopupState> {
  render() {
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

export default Popup;