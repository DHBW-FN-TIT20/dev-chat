import { IUser } from "../public/interfaces";

/**
 * Base class for all console commands.
 * Extend this class to create new console commands.
 * An example of a child class can be found in the file console_commands/example.ts
 * The constructor of this class should be called in the child class (super()).
 * The properties callString and helpText should be overwritten in the child class.
 * The execute() function should be overwritten in the child class.
 * @class Command
 */
export class Command {
    public callString: string;
    public helpText: string;
    
    public constructor() {
      this.callString = ""; // this should be overwritten with the command call string, for example "/calculate"
      this.helpText = "";   // this should be overwritten with the help text for the command
    }

    /**
     * Executes the command.
     * @param {string[]} args the arguments of the command
     * @param {IUser} currentUser the user who executed the command
     * @param {number} currentChatKeyID the chat key ID of the chat the command was executed in
     * @returns 
     */
    public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
      let answerLines: string[] = [];
      console.log("Executing command: ", this.callString, " with arguments: ",  args);
      return answerLines;
    }
  }