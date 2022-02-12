import { SupabaseConnection } from "../pages/api/supabaseAPI";
import { IBugTicket, IUser } from "../public/interfaces";
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

      // save the date 
      let currentDate: Date = new Date();

      // Connect to supabase
      const supabaseConnection = new SupabaseConnection();

      let bugToReport: IBugTicket = {
        submitter: currentUser,
        date: currentDate,
        message: args.join(" "),
        solved: false,
      };
      // add the surves to the database
      let addedTicket: IBugTicket | null = await supabaseConnection.addNewTicket(bugToReport);

      // check if the survey was added successfully 
      if (addedTicket === null) {
        answerLines.push(bugToReport.message)
        answerLines.push("Error: There was a problem with your ticket. Please try again.");
        return answerLines;
      }

      console.log("Executing command: ", this.callString, " with arguments: ", args);
      answerLines.push(args.join(" "));
      answerLines.push(" \n\t Thank you for submitting a bug. The development team will fix the bug soon!");
      return answerLines;
    }
    
  }