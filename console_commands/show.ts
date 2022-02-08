import { SupabaseConnection } from "../pages/api/supabaseAPI";
import { ISurvey, ISurveyState, ISurveyVote, IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to show the current results of a survey.
 * It is triggerd by the command "/show"
 * Pattern: "/show <SurveyID>"
 */
export class ShowCommand extends Command {
  public constructor() {
    super();
    this.callString = "show";
    this.helpText = "run '/show <SurveyID>' to show the current results of a survey";
  }
  
  public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    console.log("ShowCommand.execute()");
    
    let answerLines: string[] = [];
    
    // check if there is 1 argument and the id is a number
    if (args.length !== 1 || isNaN(Number(args[0]))) {
      return ["Error: Invalid arguments."];
    }

    // ----------------------------------------------------------------
    const supabaseConnection = new SupabaseConnection();
    
    // get the survey with the given id
    let survey: ISurveyState | null = await supabaseConnection.getCurrentSurveyState(Number(args[0]));

    // check if the vote was added successfully 
    if (survey === null) {
      answerLines.push("Error: Could not find the survey.");
      return answerLines;
    }

    answerLines.push(`ID: ${survey.id}`);
    answerLines.push(`Name: ${survey.name}`);
    answerLines.push(`Options:`);

    for (let option of survey.options) {
      answerLines.push(`  ${option.option.name} (ID: ${option.option.id}): ${option.votes} votes`);
    }

    return answerLines;
  }
  
}