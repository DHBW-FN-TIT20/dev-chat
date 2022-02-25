import { IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * Class for /help Command
 */
export class HelpCommmand extends Command {
  private allCommands;
  public constructor(commands: Command[]) {
    super();
    this.callString = "help";
    this.helpText = "";
    this.allCommands = commands;
  }

  public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    let answerLines: string[] = [];
    answerLines.push("Showing all available commands:")
    console.log("Executing command: ", this.callString, " with arguments: ", args);
    for (let i = 0; i < this.allCommands.length; i++) {
      let currentAccessLevel = currentUser.accessLevel ? currentUser.accessLevel : 0
      if (currentAccessLevel >= this.allCommands[i].minimumAccessLevel) {
        answerLines.push("  /" + this.allCommands[i].callString);
      }
    }
    //answerLines.push("/help")
    return answerLines;
  }

}