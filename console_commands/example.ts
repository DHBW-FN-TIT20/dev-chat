import { IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
  * Example how to 
  */
export class ExampleCommand extends Command {
    public constructor() {
      super();
      this.callString = "example";
      this.helpText = "This is an example command!";
    }
    
    public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
      let answerLines: string[] = [];
      console.log("Executing command: ", this.callString, " with arguments: ", args);
      
      // ----------------------------------------------------------------
      // here you can add your code to execute the command
      // the answer should be added to the answerLines array
      // there shold be a answer
      // otherwise it means the command was not executed successfully
      // ----------------------------------------------------------------

      return answerLines;
    }
    
  }