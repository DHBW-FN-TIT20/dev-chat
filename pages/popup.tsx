import React, { Component } from 'react'
import styles from '../styles/Popup.module.css'

export interface PopupState {
}

export interface PopupProps {
  textDisplay: string,
  closePopup: any,
}

export default class Popup extends Component<PopupProps, PopupState> {
  constructor(props: PopupProps) {
    super(props)
    this.state = {
    }
  }
  render() {
    console.log(this.props.closePopup);
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <h1>{this.props.textDisplay}</h1>
          <button className={styles.buttonPopup} onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
      );
  }
}