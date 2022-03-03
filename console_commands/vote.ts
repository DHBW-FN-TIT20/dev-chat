import { BackEndController } from "../controller/backEndController";
import { DatabaseModel } from "../pages/api/databaseModel";
import { ISurveyVote, IUser } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to vote for an option in a survey
 * It is triggerd by the command "/vote"
 * Pattern: "/vote <SurveyID> <OptionID>"
 * @category Command
 */
export class VoteCommand extends Command {
  constructor() {
    super();
    this.callString = "vote";
    this.helpText = "run '/vote <SurveyID> <OptionID>' to vote for an option in a survey";
  }

  async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
    console.log("VoteCommand.execute()");

    const answerLines: string[] = [];

    // check if there are 2 arguments and the ids are numbers
    if (args.length !== 2 || isNaN(Number(args[0])) || isNaN(Number(args[1]))) {
      return [];
    }

    // ----------------------------------------------------------------
    const databaseModel = new DatabaseModel();
    const backEndController = new BackEndController();

    const voteToAdd: ISurveyVote = {
      surveyID: Number(args[0]),
      optionID: Number(args[1]),
      userID: currentUser.id,
    };

    // check if the survey is in the current room
    if (!databaseModel.evaluateSuccess(await databaseModel.selectSurveyTable(voteToAdd.surveyID, undefined, undefined, undefined, undefined, currentChatKeyID))) {
      answerLines.push("Error: Cannot find survey in this room.");
      return answerLines;
    }

    // add the vote to the database
    const addedVote: boolean = await backEndController.addNewVote(voteToAdd);

    // check if the vote was added successfully 
    if (!addedVote) {
      answerLines.push("Error: Vote not successfull. If you have not voted already, try again.");
      return answerLines;
    }

    answerLines.push(`Vote added successfully: SurveyID: ${voteToAdd.surveyID}, OptionID: ${voteToAdd.optionID}`);

    return answerLines;
  }
}