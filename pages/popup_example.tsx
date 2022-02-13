import React, { Component } from 'react'
import Popup from './popup';

export interface PopupExampleState {
    showPopup: boolean
}

export interface PopupExampleProps {
  textDisplay: string
}



export default class PopupExample extends Component<PopupExampleProps, PopupExampleState> {
  constructor(props: PopupExampleProps) {
    super(props)
    this.state = {
        showPopup: false,
    }
  }

  togglePopup() {
        this.setState({
        showPopup: !this.state.showPopup
        });
    }

  render() {
    return (
        <div>
            <h1>Testing Popup</h1>
            <button onClick={this.togglePopup.bind(this)}>show Popup</button>
            {this.state.showPopup ? 
              <Popup
                headerText='PopUp Caption'
                textDisplay='This is nice PopUp made by good Programmer'
                closePopup={this.togglePopup.bind(this)}
              />
              : null
            }
        </div>
      );
  }
}