import React, { Component } from 'react'
import Popup from '../components/popup';

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
                headerText='Delete User'
                textDisplay='The User "Henry" was succesfully deleted. You will be returned to the login page.'
                closePopup={this.togglePopup.bind(this)}
              />
              : null
            }
        </div>
      );
  }
}