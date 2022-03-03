import { DatabaseModel } from "../pages/api/databaseModel";
import { IBugTicket, IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to report a bug
 * It is triggerd by the command "/report"
 * Pattern: "/report <message>"
 * @category Command
 */
export class ReportCommand extends Command {
  constructor() {
    super();
    this.callString = "report";
    this.helpText = "run '/report <message>' to report a bug";
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    const answerLines: string[] = [];

    // Connect to supabase
    const databaseModel = new DatabaseModel();

    const message = args.join(" ");

    // add the ticket to the database
    const addedTicket: IBugTicket = databaseModel.getIBugTicketFromResponse(await databaseModel.addTicket(currentUser.id, message))[0];

    // check if the ticket was added successfully 
    if (addedTicket === undefined) {
      answerLines.push("There was a problem with your ticket. Please try again.");
      return answerLines;
    }

    console.log("Executing command: ", this.callString, " with arguments: ", args);

    answerLines.push("Thank you for submitting a bug. The development team will fix the bug soon!");
    return answerLines;
  }
}
