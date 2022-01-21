import React, { Component } from "react";
import Head from 'next/head'

export interface InputChangeState {
    count_keys: number;
    input_val: string;
  }
  
export interface InputChangeProps {}
  /**
   * Component-Class for the main Page
   */
class InputChange extends React.Component<InputChangeProps, InputChangeState> {
    constructor(props: InputChangeProps){
        super(props);
        this.state={
            count_keys : 0,
            input_val : "",
        }
        
    }
    

  // Input Field handler
  handleUserInput = (e:any) => {
      this.setState({input_val: e.target.value})
  };

  // Reset Input Field handler
  resetInputField = () => {
    this.setState({input_val: ""})
  };

  render(){
  return (
    <div>
      {/* Input Field */}
      <input type="text" value={this.state.input_val} onChange={this.handleUserInput} />

      {/* Reset button */}
      <button onClick={this.resetInputField}>Reset</button>
    </div>
  );
  }
}
  

export default InputChange;