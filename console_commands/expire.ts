import { AccessLevel } from "../enums/accessLevel";
import { DatabaseModel } from "../pages/api/databaseModel";
import { IChatKey, IUser } from "../public/interfaces";
import { getDateByGermanString } from "../shared/get_date_by_german_string";
import { Command } from "./baseclass";

/**
 * This command is used to set a new ExpirationDate for the Current Chat
 * It is triggerd by the command "/expire"
 * Pattern: "/expire <ExpirationDate (dd.MM.yyyy HH:mm)>"
 * @category Command
 */
export class ExpireCommand extends Command {
  constructor() {
    super();
    this.callString = "expire";
    this.helpText = "run '/expire <ExpirationDate (DD.MM.YYYY-HH:MM)>' to set a new ExpirationDate for the Current Chat";
    this.minimumAccessLevel = AccessLevel.ADMIN;
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    console.log("ShowCommand.execute()");

    const answerLines: string[] = [];

    // check if the arguments are valid 
    console.log(args[0])

    // check if the first argument is a valid expiration date in format DD.MM.YYYY-HH:MM
    const expirationDate: Date | null = getDateByGermanString(args[0]);
    
    if (args.length !== 1 || expirationDate === null) {
      return answerLines;
    }

    //Args are Valid and the user has the required Permissions => He can execute the command
    const databaseModel = new DatabaseModel();

    //Update the ExpirationDate from the current Chat Key
    const updatedChatKey: IChatKey = databaseModel.getIChatKeyFromResponse(await databaseModel.changeChatKeyExpirationDate(currentChatKeyID, expirationDate))[0];

    // check if the new ChatKey exists 
    if (updatedChatKey === undefined) {
      answerLines.push("Error: Could not update the expiration Date from the current chat to database.");
      return answerLines;
    }

    answerLines.push("The chat expiration date was successfully changed.");
    answerLines.push("ExpirationDate: " + updatedChatKey.expirationDate.toLocaleDateString());

    return answerLines;
  }
}