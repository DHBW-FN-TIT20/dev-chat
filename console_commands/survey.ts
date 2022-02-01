import { SupabaseConnection } from "../pages/api/supabaseAPI";
import { ISurvey } from "../public/interfaces";
import { Command } from "./baseclass";

/**
 * This command is used to start the survey.
 * It is triggerd by the command "/survey"
 * Pattern: /survey <SurveyName> <"Description"> <ExpirationDate (DD.MM.YYY)> <Option1> <Option2> [... <OptionN>]
 */
export class ExampleCommand extends Command {
    public constructor() {
      super();
      this.callString = "survey";
      this.helpText = "run '/survey <SurveyName> <''Description''> <ExpirationDate (DD.MM.YYY)> <Option1> <Option2> [... <OptionN>]' to start a new survey";
    }
    
    public async execute(args: string[], currentUsername: string, currentUserPassword: string, currentChatKey: string): Promise<string[]> {
      let answerLines: string[] = [];
      
      // check if the arguments are valid 
      let argsValid: boolean = true;

      // check if there are at least 4 arguments
      if (args.length < 5) {
        argsValid = false;
      }

      // check if the first argument is a valid survey name
      // NOTE: maybe add checks for the survey name here

      // check if the second argument is a valid expiration date in format DD.MM.YYYY
      let expirationDate: Date = new Date(args[2]);
      if (isNaN(expirationDate.getTime())) {
        argsValid = false;
      }

      // if arguments are not valid, return an empty array to indicate that the command was not executed successfully
      if (!argsValid) {
        return [];
      }

      // ----------------------------------------------------------------

      const supabaseConnection = new SupabaseConnection();


      let surveyToAdd: ISurvey = {
        name: args[0],
        description: args[1],
        expirationDate: expirationDate,
        options: args.slice(3).map(option => { return { name: option } }),
        ownerID: await supabaseConnection.getUserIDByUsername(currentUsername),
      };

      // add the surves to the database
      let addedSurvey: ISurvey | null = await supabaseConnection.addNewSurvey(surveyToAdd);

      // check if the survey was added successfully 
      if (addedSurvey === null) {
        answerLines.push("Error: Could not add survey to database.");
        return answerLines;
      }

      answerLines.push("Survey started successfully!");
      answerLines.push("ID: " + addedSurvey.id);
      answerLines.push("Name: " + addedSurvey.name);
      answerLines.push("Description: " + addedSurvey.description);
      answerLines.push("Expiration Date: " + expirationDate.toLocaleDateString());

      // display the options
      addedSurvey.options.forEach((option) => {
        answerLines.push("Option " + option.id + ": " + option.name);
      });

      return answerLines;
    }
    
  }