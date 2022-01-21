import React, { Component } from "react";
import Head from 'next/head'

export interface MainState {
    count_keys: number;
  }
  
export interface MainProps {}
  /**
   * Component-Class for the main Page
   */
class Keylisten extends Component<MainProps, MainState> {
    constructor(props: MainProps){
        super(props);
        this.state={
            count_keys : 0,
        }
        
    }
    componentDidMount(){

        

    }
    render() {
        return(
            <div>
            <main>
                <h1> 
                Key Listener
                </h1>
                <p>Count Enters:{this.state.count_keys}</p>
                <input type="text" placeholder="Chat Line"onKeyPress={this.handleKeyPress}/>
            </main>
            </div>
        
        )
    }
    handleKeyPress = (event: any) => {
        if(event.key === 'Enter'){
          this.setState({ count_keys: this.state.count_keys+ 1 })
          alert(event.key)
        }
    }
}
  

export default Keylisten;