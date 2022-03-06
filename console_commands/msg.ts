import { DatabaseModel } from "../pages/api/databaseModel";
import { IUser } from "../public/interfaces";
import { Command } from "./baseclass";
import { BackEndController } from '../controller/backEndController';

/**
 * This command is used to send a direct message
 * It is triggerd by the command "/msg"
 * Pattern: "/msg <targetUsername> <message>"
 * @category Command
 */
export class MsgCommand extends Command {
  constructor() {
    super();
    this.callString = "msg";
    this.helpText = "run '/msg <targetUsername> <message>' to direct message a user";
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    const answerLines: string[] = [];

    // check if the arguments are valid 
    let argsValid: boolean = true;

    if (args.length < 2) {
      argsValid = false;
    }

    console.log("ArgsValid: " + argsValid);

    // if arguments are not valid, return an empty array to indicate that the command was not executed successfully
    if (!argsValid) {
      return [];
    }

    // Connect to supabase
    const databaseModel = new DatabaseModel();
    const backEndController = new BackEndController();

    console.log(args)
    const targetUsername: string = args[0];

    if (targetUsername === "" || targetUsername === undefined) {
      return [];
    }

    const targetUser: IUser = databaseModel.getIUserFromResponse(await databaseModel.selectUserTable(undefined, targetUsername))[0];

    if (targetUser === undefined) {
      answerLines.push("The given user does not exist.");
      return answerLines;
    }

    let message: string = "";
    console.log(args.length);
    for (let i = 1; i < args.length; i++) {
      message += args[i] + " ";
    }

    if (message.replace(/\s/g, "") === "") {
      answerLines.push("No message was entered.");
      return answerLines;
    }

    console.log("Message " + message);
    console.log("currentChatKeyID " + currentChatKeyID);
    console.log("targetUserId " + targetUser.id);
    console.log("currentUser.id " + currentUser.id);

    const whisperMessage: string = currentUser.name + " whispers to you: " + message;

    if (await backEndController.addChatMessage(whisperMessage, currentChatKeyID, currentUser.id, targetUser.id)) {
      answerLines.push("The message was send to " + targetUsername + " succesfully.");
    } else {
      answerLines.push("The message could not be sent, please try again.");
    }
    return answerLines;
  }
}
