import { SupabaseConnection } from "../pages/api/supabaseAPI";
import { IBugTicket, IUser } from "../public/interfaces";
import { Command } from "./baseclass";


/**
 * This command is to send a direct message
 * It is triggerd by the command "/msg"
 * Pattern: /msg <targetUsername> <message>
 */
export class MsgCommand extends Command {
    public constructor() {
        super();
        this.callString = "msg";
        this.helpText = "run '/msg <targetUsername> <message>' to direct message a user! ";
    }

    public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
        let answerLines: string[] = [];

        // check if the arguments are valid 
        let argsValid: boolean = true;

        if (args.length <= 2) {
            argsValid = false;
        }

        console.log("ArgsValid: " + argsValid);

        // if arguments are not valid, return an empty array to indicate that the command was not executed successfully
        if (!argsValid) {
            return [];
        }

        // Connect to supabase
        const supabaseConnection = new SupabaseConnection();

        console.log(args)
        let targetUsername: string = args[0];
        let targetUserId: number = NaN;

        if (targetUsername !== "" || targetUsername !== undefined) {
            targetUserId = await supabaseConnection.getUserIDByUsername(targetUsername)
        }

        let message: string = "";
        console.log(args.length);
        for(let i = 1; i < args.length; i++) {
            message += args[i] + " ";
        }
        let commandExecutable: boolean = false;
        if(!isNaN(targetUserId) && message !== "") {
          commandExecutable = true;
        }
        
        console.log("Message " + message);
        console.log("currentChatKeyID " + currentChatKeyID);
        console.log("targetUserId " + targetUserId);
        console.log("currentUser.id " + currentUser.id);

        if(commandExecutable && currentUser.id !== undefined) {
            let whisperMessage: string = currentUser.name + " whispers to you: " + message
            if(await supabaseConnection.addChatMessage(whisperMessage, currentChatKeyID, currentUser.id, targetUserId)) {
                answerLines.push("The message was send to " + targetUsername + " succesfully.");
            }
            else {
                answerLines.push("Nachricht konnte nicht zugestellt werden.");
            }
        }
        return answerLines;
    }
}
