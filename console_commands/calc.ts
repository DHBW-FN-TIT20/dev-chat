import { IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to calculate a mathematical expression
 * It is triggerd by the command "/calc"
 * Pattern: /calc <Mathematical Expression>
 */
export class CalcCommand extends Command {
    public constructor() {
      super();
      this.callString = "calc";
      this.helpText = "run '/calc <Mathematical Expression>'  to calculate ";
    }
    
    public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
      let answerLines: string[] = [];

       // check if the arguments are valid 
       let argsValid: boolean = true;

       // check if there is more than one argument
       if (args.length != 1) {
         argsValid = false;
       }
       // if argument is invalid, return nothing
       if (!argsValid) {
        return [];
      }
       // if argument is not a number, return nothing
      if(isNaN(Number(args[0]))){
        return [];
      }

      console.log("Executing command: ", this.callString, " with arguments: ", args);
      let expression: string = args[0];
      console.log(eval(expression));
      answerLines[0] = String("Your Answer is: " + eval(expression));
      return answerLines;
    }
    
  }