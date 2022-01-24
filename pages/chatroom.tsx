import React, { Component } from "react";
/**
 * State for the ChatInputLine
 */
export interface ChatInputLineState {
  count_keys: number;
  chatLineInput: string;
}

/**
 * Props for the ChatInputLine-Component
 */
export interface ChatInputLineProps {
}

/**
 * @class Component-Component for the Chat Input Line
 */
class ChatInputLine extends Component<ChatInputLineProps, ChatInputLineState> {

  /**
   * Constuctor for the ChatInputLine-Component
   * @param props Props of the ChatInputLine-Component
   */
  constructor(props: ChatInputLineProps) {
    super(props);
    this.state = {
      count_keys: 0,
      chatLineInput: "",
    }
  }

  /**
   * Creates the JSX Output of ChatLineInput
   * @returns JSX Output
   */
  render() {
    return (
      <div>
        <main>
          <h1>
            Chat Room
          </h1>
          <p>Count Enters:{this.state.count_keys}</p>
          <input type="text" value={this.state.chatLineInput} placeholder="Chat Line" onKeyPress={this.handleEnterKeyPress} onChange={this.handleChatLineInput} />
        </main>
      </div>
    )
  }

  /**
   * Handle of the Keypressed-Event from the Input
   * Checks if Enter was pressed
   * @param event Occurred Event
   */
  handleEnterKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      console.log("Enter pressed");
      this.setState({ count_keys: this.state.count_keys + 1 });
      this.setState({ chatLineInput: "" });
    }
  }

  /**
   * Handel of the OnChange-Event from the Input
   * updates the Value of the Input-Line
   * @param event Occured Event
   */
  handleChatLineInput = (event: any) => {
    this.setState({ chatLineInput: event.target.value });
  };
}

export default ChatInputLine;