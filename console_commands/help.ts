import { IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to get all available commands
 * It is triggerd by the command "/help"
 * Pattern: "/help"
 * @category Command
 */
export class HelpCommmand extends Command {
  constructor(private allCommands: Command[]) {
    super();
    this.callString = "help";
    this.helpText = "run '/help' to get a list of all available commands";
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    const answerLines: string[] = [];
    answerLines.push("Showing all available commands:")

    console.log("Executing command: ", this.callString, " with arguments: ", args);

    for (let i = 0; i < this.allCommands.length; i++) {
      if (currentUser.accessLevel >= this.allCommands[i].minimumAccessLevel) {
        answerLines.push("  /" + this.allCommands[i].callString);
      }
    }
    //answerLines.push("/help")
    return answerLines;
  }
}
