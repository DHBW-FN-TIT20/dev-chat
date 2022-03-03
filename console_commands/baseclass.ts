import { AccessLevel } from "../enums/accessLevel";
import { IUser } from "../public/interfaces";

/**
 * Base class for all console commands.
 * Extend this class to create new console commands.
 * An example of a child class can be found in the file console_commands/example.ts
 * The constructor of this class should be called in the child class (super()).
 * The properties callString and helpText (and minimumAccessLevel) should be overwritten in the child class.
 * The execute() function should be overwritten in the child class.
 * @class Command
 * @category Command
 */
export class Command {
    callString: string = ""; // this should be overwritten with the command call string, for example "/calculate"
    helpText: string = ""; // this should be overwritten with the help text for the command
    minimumAccessLevel: AccessLevel = AccessLevel.USER; // this should be overwritten with the minimum access level required to execute the command

    /**
     * Executes the command.
     * @param args the arguments of the command (message string elements)
     * @param currentUser the user who executed the command
     * @param currentChatKeyID the chat key ID of the chat the command was executed in
     * @returns answer lines for the user
     */
    async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
      const answerLines: string[] = [];
      console.log("Executing command: ", this.callString, " with arguments: ",  args);
      return answerLines;
    }
  }