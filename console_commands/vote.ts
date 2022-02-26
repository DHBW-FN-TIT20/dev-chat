import { SupabaseConnection } from "../pages/api/supabaseAPI";
import { ISurvey, ISurveyVote, IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to vote for an option in a survey.
 * It is triggerd by the command "/vote"
 * Pattern: "/vote <SurveyID> <OptionID>"
 */
export class VoteCommand extends Command {
    public constructor() {
      super();
      this.callString = "vote";
      this.helpText = "run '/vote <SurveyID> <OptionID>' to vote for an option in a survey";
    }
    
    public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
      console.log("VoteCommand.execute()");
      
      let answerLines: string[] = [];
      
      // check if there are 2 arguments and the ids are numbers
      if (args.length !== 2 || isNaN(Number(args[0])) || isNaN(Number(args[1])) || currentUser.id === undefined) {
        return [];
      }

      // ----------------------------------------------------------------
      const supabaseConnection = new SupabaseConnection();

      let voteToAdd: ISurveyVote = {
        surveyID: Number(args[0]),
        optionID: Number(args[1]),
        userID: currentUser.id,
      };

      // check if the survey is in the current room
      if (! await supabaseConnection.isSurveyInRoom(voteToAdd.surveyID, currentChatKeyID)) {
        return ["Error: Cannot find survey in this room."]
      }
      
      // add the vote to the database
      let addedVote: ISurveyVote | null = await supabaseConnection.addNewVote(voteToAdd);

      // check if the vote was added successfully 
      if (addedVote === null) {
        answerLines.push("Error: Could not add vote to database.");
        return answerLines;
      }

      answerLines.push(`Vote added successfully: SurveyID: ${addedVote.surveyID}, OptionID: ${addedVote.optionID}`); // maybe add: , UserID: ${addedVote.userID}

      return answerLines;
    }
    
  }