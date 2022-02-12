import { SupabaseConnection } from "../pages/api/supabaseAPI";
import { IChatKey, IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to set a new ExpirationDate for the Current Chat
 * It is triggerd by the command "/expire"
 * Pattern: "/expire <ExpirationDate (dd.MM.yyyy HH:mm)>"
 */
export class ExpireCommand extends Command {
  public constructor() {
    super();
    this.callString = "expire";
    this.helpText = "run '/expire <ExpirationDate (dd.MM.yyyy HH:mm)>' to set a new ExpirationDate for the Current Chat";
    this.minimumAccessLevel = 1;
  }
  
  public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    console.log("ShowCommand.execute()");
    
    let answerLines: string[] = [];

    // check if the arguments are valid 
    let argsValid: boolean = true;

    if(args.length !== 1) {
        argsValid = false;
    }

    console.log("ArgsValid: " + argsValid)

    // check if the first argument is a valid expiration date in format dd.MM.yyyy HH:mm
    // Man kann aktuell nur amerikanische Date Format ohne Zeit eingeben
    let expirationDate: Date = new Date(args[0]);
    if (isNaN(expirationDate.getTime())) {
      argsValid = false;
    }

    console.log("ArgsValid: " + argsValid)

    // if arguments are not valid, return an empty array to indicate that the command was not executed successfully
    if (!argsValid) {
        return [];
    }

    //Args are Valid and the user has the required Permissions => He can execute the command
    const supabaseConnection = new SupabaseConnection();

    //Update the ExpirationDate from the current Chat Key
    let updatedChatKey: IChatKey | null = await supabaseConnection.updateExpirationDateFromCurrentChatKey(currentChatKeyID, expirationDate)

    // check if the new ChatKey exists 
    if (updatedChatKey === null) {
        answerLines.push("Error: Could not update the expiration Date from the current chat to database.");
        return answerLines;
    }

    answerLines.push("The chat expiration date was successfully changed.");
    answerLines.push("ExpirationDate: " + updatedChatKey.expirationDate?.toLocaleDateString());

    return answerLines;
  }
}