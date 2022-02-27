//#region Imports

import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IChatKey, IChatMessage, ISurvey, ISurveyState, ISurveyVote, IUser, IBugTicket } from '../public/interfaces';
import { ExampleCommand } from '../console_commands/example';
import { Command } from '../console_commands/baseclass';
import splitString from '../shared/splitstring';
import { SurveyCommand } from '../console_commands/survey';
import { VoteCommand } from '../console_commands/vote';
import { CalcCommand } from '../console_commands/calc';
import { ReportCommand } from '../console_commands/report';
import { ShowCommand } from '../console_commands/show';
import { ExpireCommand } from '../console_commands/expire';
import { HelpCommmand } from '../console_commands/help';
import { MsgCommand } from '../console_commands/msg';
import { DatabaseModel } from '../pages/api/databaseModel';


//#endregion

/**
 * This is the connection to the supabase database.
 * All the api routes should lead to this class.
 * The methods of the class are used to get/post data from/to the database.
 */
export class BackEndController {

  //#region Private Variables
  private static KEY: string;
  private commands: Command[] = [];
  private databaseModel = new DatabaseModel();

  //#endregion

  //#region Constructor
  constructor() {
    BackEndController.KEY = process.env.HASH_KEY || '';
    this.commands = [
      // add all command classes here
      new ExampleCommand,
      new SurveyCommand,
      new VoteCommand,
      new CalcCommand,
      new ReportCommand,
      new ShowCommand,
      new ExpireCommand,
      new MsgCommand,
    ];
    this.commands.push(new HelpCommmand(this.commands))
  }

  //#endregion

  //#region "Command" Methods

  /**
  * This function is used to check a new message for commands. 
  * After the command is found, the command is executed.
  * The Command.execute() method is called and it returns the answer of the command as an array of strings.
  * Each string represents one line of the answer and is sent as a message to the user.
  * @param {string} userInput the message typed in by the user
  * @param {IUser} currentUser the user who fired the command
  * @param {number} currentChatKeyID the id of the chat the user is in
  * @returns {Promise<boolean>} Returns true if a command was executed successfully. Returns false if no command was executed or if the command failed to execute.
  */
  private async executeCommand(userInput: string, userId: number, currentChatKeyID: number): Promise<boolean> {
    let currentUser: IUser = await this.databaseModel.getIUserByUserID(userId);

    // split the user input into the command and the arguments
    let callString: string = splitString(userInput)[0].slice(1);
    let callArguments: string[] = splitString(userInput).slice(1);

    // console.log("SupabaseConnection.executeCommand()", callString, callArguments);
    this.databaseModel.addChatMessage(userInput, currentChatKeyID, userId, userId)

    //const { data, error } = await BackEndController.CLIENT
    //.from('ChatMessage')
    //.insert([
    //{ ChatKeyID: currentChatKeyID, UserID: userId, TargetUserID: userId, Message: userInput },
    //])

    let commandFound: boolean = false;
    for (let i = 0; i < this.commands.length; i++) {
      let command = this.commands[i];
      console.log(command.callString, callString);

      if (command.callString == callString) {
        // a command was found -> execute it
        // console.log("command found");
        commandFound = true;
        let answerLines: string[];

        // check if user is allowed to execute the command
        let currentAccessLevel = currentUser.accessLevel ? currentUser.accessLevel : 0
        if (currentAccessLevel >= command.minimumAccessLevel) {
          answerLines = await command.execute(callArguments, currentUser, currentChatKeyID);
        } else {
          answerLines = ["Error: Not allowed to execute this command!"]
        }

        // check if the command was executed successfully (If this is not the case, command.execute returns an empty array.)
        if (answerLines.length === 0 || answerLines === undefined) {
          // no answer -> command was not executed successfully
          // adding the Help Text in the DB to display in the Chat
          this.databaseModel.addChatMessage(command.helpText, currentChatKeyID, 1, userId)
          //const { data, error } = await BackEndController.CLIENT
          //.from('ChatMessage')
          //.insert([
          //{ ChatKeyID: currentChatKeyID, UserID: '1', TargetUserID: userId, Message: command.helpText },
          //])
          return false;
        } else {

          console.log(answerLines);

          // create a message for each line of the answer
          for (let i = 0; i < answerLines.length; i++) {
            this.databaseModel.addChatMessage(answerLines[i], currentChatKeyID, 1, userId)
            //const { data, error } = await BackEndController.CLIENT
            //.from('ChatMessage')
            //.insert([
            //{ ChatKeyID: currentChatKeyID, UserID: '1', TargetUserID: userId, Message: answerLines[i] },
            //])
          }

          // console.log("Command executed successfully.");

          return true; // answer -> command was executed successfully
        }
      }
    };
    if (commandFound == false) {
      // console.log("No command /" + callString + " found");
      this.databaseModel.addChatMessage('No Command /' + callString + ' found', currentChatKeyID, 1, userId)
      //const { data, error } = await BackEndController.CLIENT
      //.from('ChatMessage')
      //.insert([
      //{ ChatKeyID: currentChatKeyID, UserID: '1', TargetUserID: userId, Message: 'No Command /' + callString + ' found' },
      //])
    }

    return false; // command was not found
  }

  //#endregion

  //#region Token Methods

  /**
  * This method validates a given token with the current key.
  * @param {string} token Token to validate
  * @returns {boolean} True if the token is valid, false if not
  */
  public isTokenValid = (token: string): boolean => {
    try {
      jwt.verify(token, BackEndController.KEY);
      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  /**
  * This method checks whether a given token is valid and contains an existing user
  * @param {string} token Token with user credentials
  * @returns {boolean} True if token contains a valid user, false if not
  */
  public isUserTokenValid = async (token: string): Promise<boolean> => {
    if (this.isTokenValid(token) && await this.databaseModel.userAlreadyExists(this.getUsernameFromToken(token))) {
      // console.log("user exists")
      return true;
    }
    return false;
  }

  /**
  * This method extracts the username from a token
  * @param {string} token Token to extract username from
  * @returns {string} Username if token contains username, empty string if not
  */
  public getUsernameFromToken = (token: string): string => {
    try {
      let data = jwt.decode(token);
      if (typeof data === "object" && data !== null) {
        return data.username
      }
    } catch (error) {

    }
    return "";
  }

  /**
  * This method checks a User for Admin-Status via his Token
  * @param {string} token Token to check for Admin-Status
  * @returns {string} true if Token is Admin-Token, false if not
  */
  public getIsAdminFromToken = (token: string): boolean => {
    try {
      let data = jwt.decode(token);
      if (typeof data === "object" && data !== null) {
        console.log("Access granted. You are an Admin!");
        return data.isAdmin;
      }
    } catch (error) {

    }
    return false;
  }

  /**
  * This method returns the userID of the user extracted from the token
  * @param {string} token Token to extract userID from
  * @returns {Promise<number>} UserID if token contains username, NaN if not
  */
  public getUserIDFromToken = async (token: string): Promise<number> => {
    let username = this.getUsernameFromToken(token);
    return await this.databaseModel.getUserIDByUsername(username);
  }

  //#endregion

  //#region Password Methods

  /**
  * This method checks a password for requirements
  * @param {string} password password to check
  * @returns {boolean} true if the password meets the requirements, false if not
  */
  public isPasswordValid = (password: string): boolean => {
    /**
    * Requirements:
    * Length: min. 8 characters
    * Characters: min. 1 number, 1 uppercase character, 1 lowercase character, 1 special character
    * Characters: only letters and numbers + !*#,;?+-_.=~^%(){}|:"/
    */
    if (password.length >= 8) {
      if (password.match(".*[0-9].*") && password.match(".*[A-Z].*") && password.match(".*[a-z].*") && password.match('.*[!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-].*')) {
        if (password.match('^[a-z,A-Z,0-9,!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-]*$')) {
          return true;
        }
      }
    }
    return false;
  }

  /**
  * Function to hash a password
  * @param {string} password password to hash
  * @returns {Promise<string>} hashed password
  */
  private hashPassword = async (password: string): Promise<string> => {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword
  }

  /**
  * Function to check plain text with hash
  * @param {string} clearPassword password as plain text
  * @param {string} hashedpassword password as hash from db
  * @returns {Promise<boolean>} true if password and hash match, flase if not
  */
  private checkPassword = async (clearPassword: string, hashedpassword: string): Promise<boolean> => {
    return await bcrypt.compare(clearPassword, hashedpassword);
  }

  //#endregion

  //#region User Methods

  /** 
   * This function is used to demote a user
   */
  public updateUserAccessLevel = async (token: string, name: string | undefined, newAccessLevel: number): Promise<boolean> => {
    let changedSucessfully: boolean = false;
    let userIsValid: boolean = await this.getIsAdminFromToken(token);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return changedSucessfully;
    }

    let userID = await this.databaseModel.getUserIDByUsername(name);
    return this.databaseModel.updateUserAccessLevel(newAccessLevel, userID);
  }

  /** 
   * This function is used to reset the password of a user
   */
  public resetPassword = async (token: string, name: string | undefined): Promise<boolean> => {
    let resetSucessfully: boolean = false;
    let userIsValid: boolean = await this.getIsAdminFromToken(token);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return resetSucessfully;
    }
    let hashedResetPassword = await this.hashPassword('klaushesse');
    console.log("Das Passwort wird jetzt zurückgesetzt!!");
    let resetID = await this.databaseModel.getUserIDByUsername(name);
    return this.databaseModel.resetPassword(hashedResetPassword, resetID);
  }

  /**
   * This function is used to fetch all Users from the Database
   * @param token 
   * @returns Array of all IUsers
   */
  public fetchAllUsers = async (token: string): Promise<IUser[]> => {
    let allUsers: IUser[] = [];
    // check if user is valid
    let userIsValid: boolean = await this.getIsAdminFromToken(token);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return allUsers;
    }

    allUsers = await this.databaseModel.fetchAllUsers();

    return allUsers;
  }

  /** 
  * API function to check if the username/userID and the password are correct 
  * @param {string} username the username to check
  * @param {number} userID the userID to check
  * @param {string} password the password to check
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username and password are correct
  */
  public isUserValid = async (user: { id?: number, name?: string, password: string }): Promise<boolean> => {
    let currentUser: IUser = {};

    if (user.id !== undefined) {
      currentUser = await this.databaseModel.getIUserByUserID(user.id);
    }
    else if (user.name !== undefined) {
      currentUser = await this.databaseModel.getIUserByUsername(user.name)
    }

    if (currentUser !== {} && currentUser.hashedPassword !== undefined) {
      return this.checkPassword(user.password, currentUser.hashedPassword);
    }
    return false;
  };


  /**
  * This method checks a username for requirements
  * @param {string} username username to check
  * @returns {boolean} true if the username meets the requirements, false if not
  */
  public isUsernameValid = (username: string): boolean => {
    /**
    * Requirements:
    * Length: 4-16 characters
    * Characters: only letters and numbers
    * Keyword admin is not allowed
    */
    if (username.length >= 4 && username.length <= 16) {
      if (username.match("^[a-zA-Z0-9]+$")) {
        if (username.match("[a-z,A-Z,0-9]*[a,A][d,D][m,M][i,I][n,N][a-z,A-Z,0-9]*")) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  /**
  * This method logs in a user if the given credentials are valid.
  * @param {string} username Username to log in
  * @param {string} password Password for the given username
  * @returns {Promise<string>} Signed token with username if login was successfull, empty string if not
  */
  public loginUser = async (username: string, password: string): Promise<string> => {
    if (await this.isUserValid({ name: username, password: password })) {
      let user = await this.databaseModel.getIUserByUsername(username);
      if (user !== {}) {
        console.log("User logs in:", user)
        let token = jwt.sign({
          username: username,
          isAdmin: (user.accessLevel === 1)
        }, BackEndController.KEY, { expiresIn: '1 day' });
        return token;
      }
    }
    return "";
  }

  /**
  * API function to register a user
  * @param {string} user username to register
  * @param {string} password password for the user
  * @param {number} accessLevel access level for the user
  * @returns {Promise<string>} true if registration was successfull, error Message if not
  */
  public registerUser = async (username: string, password: string, accessLevel: number = 0): Promise<string> => {
    if (await this.databaseModel.userAlreadyExists(username) == false) {
      let returnString: string = "";
      let vUsernameValid: boolean = await this.isUsernameValid(username);
      let vPasswordValid: boolean = await this.isPasswordValid(password);
      // console.log("vPasswordValid: " + vPasswordValid);
      // console.log("vUsernameValid: " + vUsernameValid);
      if (vUsernameValid == false && vPasswordValid == false) {
        returnString = "error_username_password";
      }
      else if (vPasswordValid == false) {
        returnString = "error_password";
      }
      else if (vUsernameValid == false) {
        returnString = "error_username";
      }
      else if (vUsernameValid && vPasswordValid) {
        let hashedPassword = await this.hashPassword(password);

        if (await this.databaseModel.registerUser(username, hashedPassword, accessLevel) === "True") {
          returnString = "True"
        } else {
          returnString = "False"
        }
      }
      return returnString;
    }
    else {
      return "False";
    }
  }


  /**
  * This method removes a target user from the database
  * @param {string} userToken user token to verificate delete process
  * @param {string} usernameToDelete username of user to delete
  * @returns {Promise<boolean>} true if user was deleted, false if not
  */
  public deleteUser = async (userToken: string, usernameToDelete: string): Promise<boolean> => {

    const currentUserId = await this.getUserIDFromToken(userToken);
    const targetUserId = await this.databaseModel.getUserIDByUsername(usernameToDelete);

    let userIsValid: boolean = await this.getIsAdminFromToken(userToken);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return false;
    }

    return this.databaseModel.deleteUser(targetUserId);
  }

  /**
  * This method changes the password from the current user
  * @param {string} token Token to extract username from
  * @param {string} oldPassword contains the old User Password
  * @param {string} newPassword contains the new User Password
  * @returns {Promise<boolean>} if password was changed -> return true
  */
  public changeUserPassword = async (token: string, oldPassword: string, newPassword: string): Promise<boolean> => {
    let userName: string = ""
    let currentUser: IUser

    if (await this.isUserTokenValid(token)) {
      userName = this.getUsernameFromToken(token);
      if (userName !== null && userName !== "") {
        currentUser = await this.databaseModel.getIUserByUsername(userName);
        if (currentUser !== null && this.isPasswordValid(newPassword) && currentUser.hashedPassword !== undefined && await this.checkPassword(oldPassword, currentUser.hashedPassword)) {
          //first hash then Save
          let hashedPassword = await this.hashPassword(newPassword);
          if (currentUser.id !== undefined) {
            return this.databaseModel.changeUserPassword(currentUser.id, hashedPassword);
          }
        }
      }
    }
    return false;
  }

  //#endregion

  //#region ChatKey Methods

  public changeChatKeyExpirationDate = async (token: string, chatKeyID: number | undefined, newExpirationDate: Date | null): Promise<boolean> => {
    let changedSucessfully: boolean = false;
    let userIsValid: boolean = await this.getIsAdminFromToken(token);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return changedSucessfully;
    }

    return this.databaseModel.changeChatKeyExpirationDate(chatKeyID, newExpirationDate);
  }

  public deleteChatKey = async (userToken: string, chatKeyToDelete: number | undefined): Promise<boolean> => {

    let userIsValid: boolean = await this.getIsAdminFromToken(userToken);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return false;
    }

    return this.databaseModel.deleteChatKey(chatKeyToDelete);
  }

  /**
  * This function is used to fetch all ChatKeys from the Database
  * @param token 
  * @returns Array of all IChatKeys
  */
  public fetchAllChatKeys = async (token: string): Promise<IChatKey[]> => {
    let allChatKeys: IChatKey[] = [];
    // check if user is valid
    console.log("Es geht los!!!");
    let userIsValid: boolean = await this.getIsAdminFromToken(token);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return allChatKeys;
    }

    allChatKeys = await this.databaseModel.fetchAllChatKeys();

    return allChatKeys
  }

  /** 
  * API function to add a Chat Key to the database 
  * @param {string} chatKey the Id of the new Chatroom
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatKey was added
  */
  public addChatKey = async (chatKey: string): Promise<boolean> => {

    let chatKeyExists = await this.databaseModel.chatKeyAlreadyExists(chatKey)

    if (chatKeyExists) {
      return false;
    }

    var expirationDate = new Date();
    // currentDate + 1 Day = ExpirationDate
    expirationDate.setDate(expirationDate.getDate() + 1);
    // console.log("Chat Key expires: " + expirationDate);

    return this.databaseModel.addChatKey(chatKey, expirationDate);
  };

  //#endregion

  //#region Chat Methods

  /** 
  * API function to get all chat messages from the database 
  * @param {string} token the token of the logged in user
  * @param {string} chatKey the chat key of the chat that is currently open
  * @param {number} lastMessageID the last message id point to start fetching new messages
  * @returns {Promise<IChatKeyMessage[]>}
  */
  public getChatMessages = async (token: string, chatKey: string, lastMessageID: number): Promise<IChatMessage[]> => {
    let chatMessages: IChatMessage[] = [];

    // check if user is valid
    let userIsValid: boolean = await this.isUserTokenValid(token);

    if (!userIsValid) {
      return chatMessages;
    }

    // get id of chatkey
    let chatKeyID = await this.databaseModel.getChatKeyID(chatKey);

    if (chatKeyID === null || chatKeyID === undefined) {
      return chatMessages;
    }

    let targetID = await this.getUserIDFromToken(token);

    let filterString = "TargetUserID.eq." + String(targetID) + ",TargetUserID.eq.0";

    return this.databaseModel.getChatMessages(chatKeyID, filterString, lastMessageID);
  };

  /** 
  * //TODO adding the cmd messages in the executeCommand Function
  * API function to handle a Chat Message
  * @param {string} message the message of the user
  * @param {number} chatKeyId the chatKeyId of the Chatroom
  * @param {string} userToken the token from the logged in user
  * @param {number} userId the Id of the User
  * @returns {Promise<boolean>} a promise that resolves to an boolean that the command or message was executed succesfully.
  */
  public handleChatMessage = async (message: string, chatKeyId: number, userToken?: string, userId?: number): Promise<boolean> => {
    if (userId === undefined && userToken !== undefined) {
      if (await this.isUserTokenValid(userToken)) {
        userId = await this.getUserIDFromToken(userToken);
      } else {
        return false;
      }
    } else if (userId !== undefined && userToken !== undefined) {
      return false;
    } else if (userId === undefined && userToken === undefined) {
      return false;
    } else if (userId === undefined) {
      return false;
    }


    if (message[0] === "/") {
      await this.executeCommand(message, userId, chatKeyId);
      return true;
    }
    else {
      if (await this.addChatMessage(message, chatKeyId, userId)) {
        return true;
      }
    }
    return false;
  };

  /** 
  * //TODO adding the cmd messages in the executeCommand Function
  * API function to add a Chat Message to the database 
  * @param {string} message the message of the user
  * @param {number} chatKeyId the chatKeyId of the Chatroom  
  * @param {number} targetUserId the Id of the User
  * @param {number} userId the Id of the User
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the message was added
  */
  public addChatMessage = async (message: string, chatKeyId: number, userId: number, targetUserId: number = 0): Promise<boolean> => {
    if (await this.databaseModel.getChatKey(chatKeyId) !== null) {
      console.log("UserID: " + targetUserId);
      return this.databaseModel.addChatMessage(message, chatKeyId, userId, targetUserId);
    }
    return false;
  };

  /**
   * API function to add a join/leave chat message to the database
   * @param {string} userToken the token of the user
   * @param {string} chatKey the chatKey of the chat
   * @param {string} joinOrLeave "join" or "leave"
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the message was added
   */
  public joinLeaveRoomMessage = async (userToken: string, chatKey: string, joinOrLeave: string): Promise<boolean> => {
    // verify if user is valid
    if (!this.isUserTokenValid(userToken)) {
      return false;
    }

    // get the user 
    let user = await this.databaseModel.getIUserByUserID(await this.getUserIDFromToken(userToken));
    if (user === null) {
      return false;
    }

    // get the chatKeyId
    let chatKeyID = await this.databaseModel.getChatKeyID(chatKey);
    if (chatKeyID === null) {
      return false;
    }

    // send the message to the chatroom
    if (joinOrLeave === "join") {
      return await this.handleChatMessage(user.name + " joined the chatroom", chatKeyID, undefined, 1);
    } else if (joinOrLeave === "leave") {
      return await this.handleChatMessage(user.name + " left the chatroom", chatKeyID, undefined, 1);
    } else {
      return false;
    }
  }

  //#endregion

  //#region Ticket Methods


  /**
   * This function is used to fetch all Tickets from the Database
   * @param token 
   * @returns Array of all IBugTickets
   */
  public fetchAllTickets = async (token: string): Promise<IBugTicket[]> => {
    let allTickets: IBugTicket[] = [];
    // check if user is valid
    let userIsValid: boolean = await this.getIsAdminFromToken(token);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return allTickets;
    }

    allTickets = await this.databaseModel.fetchAllTickets();

    return allTickets;
  }

  /**
  * This function is used to change the status of a ticket from to-do to solved
  * NOTE -- This function only gives feedback inside the console, not the browser!
  * @param ticketToChange The ID of the ticket, that should be changed
  * 
  * @returns boolean - true if ticked was sucessfully changed - false if not
  */
  public changeSolvedState = async (currentToken: string, ticketToChange: number | undefined, currentState: boolean | undefined): Promise<boolean> => {
    let changedSucessfully: boolean = false;
    let userIsValid: boolean = await this.getIsAdminFromToken(currentToken);
    if (!userIsValid) {
      console.log("You are not an admin!");
      return changedSucessfully;
    }
    return this.databaseModel.changeSolvedState(ticketToChange, !currentState);
  }

  //#endregion

  //#region Survey Methods

  /**
   * change the expiration Date of a certain survey inside supabase
   * @param token 
   * @param surveyID 
   * @param newExpirationDate 
   * @returns bool if sucessfull
   */
  public changeSurveyExpirationDate = async (token: string, surveyID: number | undefined, newExpirationDate: Date | null): Promise<boolean> => {
    let changedSucessfully: boolean = false;
    let userIsValid: boolean = await this.getIsAdminFromToken(token);

    if (!userIsValid) {
      console.log("You are not an admin!");
      return changedSucessfully;
    }

    return this.databaseModel.changeSurveyExpirationDate(surveyID, newExpirationDate);
  }

  /**
   * deletes a survey inside supabase
   * @param userToken 
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
  public deleteSurvey = async (userToken: string, surveyIDToDelete: number | undefined): Promise<boolean> => {

    let userIsValid: boolean = await this.getIsAdminFromToken(userToken);
    if (!userIsValid) {
      console.log("You are not an admin!");
      return false;
    }
    this.databaseModel.deleteSurveyOption(surveyIDToDelete);
    this.databaseModel.deleteSurveyVote(surveyIDToDelete);

    return this.databaseModel.deleteSurvey(surveyIDToDelete);
  }

  //#endregion
}