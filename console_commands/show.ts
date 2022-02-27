import { DatabaseModel } from "../pages/api/databaseModel";
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

    if(args.length === 0) {
      answerLines = await this.showAllCurrentSurveys(currentChatKeyID);
      return answerLines;
    } 
    
    // check if there is 1 argument and the id is a number
    if (args.length !== 1 || isNaN(Number(args[0]))) {
      return ["Error: Invalid arguments."];
    }

    const supabaseConnection = new DatabaseModel();
    
    // get the survey with the given id
    let survey: ISurveyState | null = await supabaseConnection.getCurrentSurveyState(Number(args[0]), currentChatKeyID);

    // check if the vote was added successfully 
    if (survey === null) {
      answerLines.push("Error: Could not find the survey.");
      return answerLines;
    }    

    answerLines.push(`ID: ${survey.id}`);
    answerLines.push(`Name: ${survey.name}`);
    answerLines.push(`Is expired: ${survey.expirationDate < new Date()} (Expiration date: ${survey.expirationDate.toLocaleDateString()})`);
    answerLines.push(`Options:`);

    for (let option of survey.options) {
      answerLines.push(`  ${option.option.name} (ID: ${option.option.id}): ${option.votes} votes`);
    }

    return answerLines;
  }


  /**
   * This function shows all current surveys for the current room.
   * @param {number} currentChatKeyID chat room that the user is in
   * @returns {string[]} the answer lines for the command "/show" with all current surveys
   */
  async showAllCurrentSurveys(currentChatKeyID: number): Promise<string[]> {
    let answerLines: string[] = [];

    const supabaseConnection = new DatabaseModel();

    // get all surveys
    let surveys: ISurvey[] = await supabaseConnection.getAllSurveys(currentChatKeyID);

    answerLines.push("Current Surveys:");

    // print out the surveys
    for (let survey of surveys) {
      answerLines.push(`${survey.name} ID: ${survey.id} Status: ${(survey.expirationDate < new Date()) ? "expired" : "active"}`); 
    }

    return answerLines
  }
  
}