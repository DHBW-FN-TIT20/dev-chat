import { BackEndController } from "../controller/backEndController";
import { DatabaseModel } from "../pages/api/databaseModel";
import { ISurvey, ISurveyState, IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to show the current results of a survey
 * It is triggerd by the command "/show"
 * Pattern: "/show <SurveyID>"
 * @category Command
 */
export class ShowCommand extends Command {
  constructor() {
    super();
    this.callString = "show";
    this.helpText = "run '/show <SurveyID>' to show the current results of a survey";
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    console.log("ShowCommand.execute()");

    const answerLines: string[] = [];

    if (args.length === 0) {
      return await this.showAllCurrentSurveys(currentChatKeyID);
    }

    // check if there is 1 argument and the id is a number
    if (args.length !== 1 || isNaN(Number(args[0]))) {
      return [];
    }

    const backEndController = new BackEndController();

    // get the survey with the given id
    const surveyState: ISurveyState | null = await backEndController.getSurveyState(Number(args[0]), currentChatKeyID);

    // check if the vote was added successfully 
    if (surveyState === null) {
      answerLines.push("Error: Could not find the survey.");
      return answerLines;
    }

    answerLines.push(`ID: ${surveyState.survey.id}`);
    answerLines.push(`Name: ${surveyState.survey.name}`);
    answerLines.push(`Is expired: ${surveyState.survey.expirationDate < new Date()} (Expiration date: ${new Date(surveyState.survey.expirationDate).toLocaleDateString()})`);
    answerLines.push(`Options:`);

    for (const option of surveyState.options) {
      answerLines.push(`  ${option.option.name} (ID: ${option.option.id}): ${option.votes} votes`);
    }

    return answerLines;
  }

  /**
   * This function shows all current surveys for the current room
   * @returns the answer lines for the command "/show" with all current surveys
   */
  async showAllCurrentSurveys(currentChatKeyID: number): Promise<string[]> {
    const answerLines: string[] = [];

    const databaseModel = new DatabaseModel();

    // get all surveys
    const surveys: ISurvey[] = databaseModel.getISurveyFromResponse(await databaseModel.selectSurveyTable(undefined, undefined, undefined, undefined, undefined, currentChatKeyID));

    answerLines.push("Current Surveys:");

    // print out the surveys
    for (const survey of surveys) {
      answerLines.push(`${survey.name} ID: ${survey.id} Status: ${(survey.expirationDate < new Date()) ? "expired" : "active"}`);
    }

    answerLines.push(this.helpText);

    return answerLines
  }
}