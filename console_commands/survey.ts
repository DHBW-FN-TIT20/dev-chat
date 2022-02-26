import { SupabaseConnection } from "../pages/api/supabaseAPI";
import { ISurvey, IUser } from "../public/interfaces";
import getDateByGermanString from "../shared/get_date_by_german_string";
import { Command } from "./baseclass";

/**
 * This command is used to start the survey.
 * It is triggerd by the command "/survey"
 * Pattern: /survey <SurveyName> <"Description"> <ExpirationDate (DD.MM.YYY-HH:MM)> <Option1> <Option2> [... <OptionN>]
 */
export class SurveyCommand extends Command {
    public constructor() {
      super();
      this.callString = "survey";
      this.helpText = "run '/survey <SurveyName> <\"Description\"> <ExpirationDate (DD.MM.YYY-HH:MM)> <Option1> <Option2> [... <OptionN>]' to start a new survey";
    }
    
    public async execute(args: string[], currentUser: IUser, currentChatKeyID: number): Promise<string[]> {
      console.log("SurveyCommand.execute()");
      
      let answerLines: string[] = [];
      
      // check if the arguments are valid 
      let argsValid: boolean = true;

      // check if there are at least 4 arguments
      if (args.length < 5) {
        argsValid = false;
      }

      // check if the first argument is a valid survey name
      // NOTE: maybe add checks for the survey name here

      // check if the second argument is a valid expiration date in format DD.MM.YYY-HH:MM
      let expirationDate: Date | null = getDateByGermanString(args[2]);
      if (expirationDate === null) {
        argsValid = false;
      }

      // if arguments are not valid, return an empty array to indicate that the command was not executed successfully
      if (!argsValid || currentUser.id === undefined) {
        return [];
      }

      // ----------------------------------------------------------------
      const supabaseConnection = new SupabaseConnection();

      let surveyToAdd: ISurvey = {
        name: args[0],
        description: args[1],
        expirationDate: expirationDate ? expirationDate : new Date(),
        options: args.slice(3).map(option => { return { name: option } }),
        ownerID: currentUser.id,
        chatKeyID: currentChatKeyID,
      };

      // add the surves to the database
      let addedSurvey: ISurvey | null = await supabaseConnection.addNewSurvey(surveyToAdd);

      // check if the survey was added successfully 
      if (addedSurvey === null) {
        answerLines.push("Error: Could not add survey to database.");
        return answerLines;
      }

      // send message to all that survey was created
      await supabaseConnection.addChatMessage(
        await supabaseConnection.getUsernameByUserID(addedSurvey.ownerID) + " created the Survey '" + addedSurvey.name + "' with the ID: " + addedSurvey.id + " which expires at " + addedSurvey.expirationDate.toLocaleString(), 
        addedSurvey.chatKeyID, 
        addedSurvey.ownerID);

      answerLines.push("Survey started successfully!");
      answerLines.push("ID: " + addedSurvey.id);
      answerLines.push("Name: " + addedSurvey.name);
      answerLines.push("Description: " + addedSurvey.description);
      answerLines.push("Expiration Date: " + addedSurvey.expirationDate.toLocaleString());

      // display the options
      addedSurvey.options.forEach((option) => {
        answerLines.push("Option " + option.id + ": " + option.name);
      });

      return answerLines;
    }
    
  }