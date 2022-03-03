import { IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to calculate a mathematical expression
 * It is triggerd by the command "/calc"
 * Pattern: /calc <Mathematical Expression>
 * @category Command
 */
export class CalcCommand extends Command {
  constructor() {
    super();
    this.callString = "calc";
    this.helpText = "run '/calc <Mathematical Expression>' to calculate";
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    const answerLines: string[] = [];

    // check if the arguments are valid 
    let argsValid: boolean = true;

    // check if there is more than one argument
    if (args.length != 1) {
      console.log("only one argument please!");
      argsValid = false;
    }
    // if argument is invalid, return nothing
    if (!argsValid) {
      console.log("Argument invalid");
      return [];
    }

    console.log("Executing command: ", this.callString, " with arguments: ", args);
    const expression: string = args[0];
    try {
      console.log(eval(expression));
      answerLines.push(String("Your Answer is: " + eval(expression)));
    } catch (error) {
      console.log(error);
    }
    return answerLines;
  }
}