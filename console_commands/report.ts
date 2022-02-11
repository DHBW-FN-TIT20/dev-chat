import { IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to report a bug
 * It is triggerd by the command "/report"
 * Pattern: /report <message>
 */
export class ReportCommand extends Command {
    public constructor() {
      super();
      this.callString = "report";
      this.helpText = "run '/report <message> to report a bug! ";
    }
    
    public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
      let answerLines: string[] = [];


      console.log("Executing command: ", this.callString, " with arguments: ", args);
      answerLines.push(args.join(" "));
      answerLines.push(" \n\t Thank you for submitting a bug. The development team will fix the bug soon!");
      return answerLines;
    }
    
  }