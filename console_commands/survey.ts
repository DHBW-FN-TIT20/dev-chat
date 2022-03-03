import { DatabaseModel } from "../pages/api/databaseModel";
import { ISurvey, ISurveyOption, IUser } from "../public/interfaces";
import { getDateByGermanString } from "../shared/get_date_by_german_string";
import { Command } from "./baseclass";
import { BackEndController } from '../controller/backEndController';

/**
 * This command is used to start the survey
 * It is triggerd by the command "/survey"
 * Pattern: "/survey <SurveyName> <"Description"> <ExpirationDate (DD.MM.YYY-HH:MM)> <Option1> <Option2> [... <OptionN>]""
 * @category Command
 */
export class SurveyCommand extends Command {
  constructor() {
    super();
    this.callString = "survey";
    this.helpText = "run '/survey <SurveyName> <\"Description\"> <ExpirationDate (DD.MM.YYYY-HH:MM)> <Option1> <Option2> [... <OptionN>]' to start a new survey";
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    console.log("SurveyCommand.execute()");

    const answerLines: string[] = [];

    // check if the first argument is a valid survey name
    // NOTE: maybe add checks for the survey name here

    // check if the second argument is a valid expiration date in format DD.MM.YYYY-HH:MM
    const expirationDate: Date | null = getDateByGermanString(args[2]);

    // check if there are at least 4 arguments
    // if arguments are not valid, return an empty array to indicate that the command was not executed successfully
    if (args.length < 5 || expirationDate === null) {
      return [];
    }

    // ----------------------------------------------------------------
    const databaseModel = new DatabaseModel();
    const backEndController = new BackEndController();

    const survey: ISurvey = databaseModel.getISurveyFromResponse(await databaseModel.addSurvey(args[0], args[1], expirationDate, currentUser.id, currentChatKeyID))[0];

    if (survey === undefined) {
      answerLines.push("Error: Could not create survey.");
      return answerLines;
    }

    const optionsToAdd: ISurveyOption[] = args.slice(3).map((opiton, index) => { return { id: index, surveyID: survey.id, name: opiton } });

    const surveyOptions: ISurveyOption[] = databaseModel.getISurveyOptionFromResponse(await databaseModel.addSurveyOption(optionsToAdd));

    if (surveyOptions.length === 0) {
      answerLines.push("Error: Could not create options.");
      return answerLines;;
    }

    // send message to all that survey was created
    await backEndController.addChatMessage(
      currentUser.name + " created the Survey '" + survey.name + "' with the ID: " + survey.id + " which expires at " + survey.expirationDate.toLocaleString(),
      survey.chatKeyID,
      survey.ownerID);

    answerLines.push("Survey started successfully!");
    answerLines.push("ID: " + survey.id);
    answerLines.push("Name: " + survey.name);
    answerLines.push("Description: " + survey.description);
    answerLines.push("Expiration Date: " + survey.expirationDate.toLocaleString());

    // display the options
    surveyOptions.forEach((option) => {
      answerLines.push("Option " + option.id + ": " + option.name);
    });

    return answerLines;
  }
}