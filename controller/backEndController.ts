//#region Imports

import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IChatKey, IChatMessage, IUser, IBugTicket, ISurveyVote, ISurvey, ISurveyState, ISurveyOption, IFChatMessage } from '../public/interfaces';
import { Command } from '../console_commands/baseclass';
import { splitString } from '../shared/splitstring';
import { SurveyCommand } from '../console_commands/survey';
import { VoteCommand } from '../console_commands/vote';
import { CalcCommand } from '../console_commands/calc';
import { ReportCommand } from '../console_commands/report';
import { ShowCommand } from '../console_commands/show';
import { ExpireCommand } from '../console_commands/expire';
import { HelpCommmand } from '../console_commands/help';
import { MsgCommand } from '../console_commands/msg';
import { DatabaseModel } from '../pages/api/databaseModel';
import { SystemUser } from '../enums/systemUser';
import { getThreeWords } from '../shared/threeword_generator';
import { AccessLevel, ProDemote } from '../enums/accessLevel';


//#endregion

/**
 * This is the connection to the supabase database.
 * All the api routes should lead to this class.
 * The methods of the class are used to get/post data from/to the database.
 * @category Controller
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
      new MsgCommand,
      new SurveyCommand,
      new ShowCommand,
      new VoteCommand,
      new CalcCommand,
      new ReportCommand,
      new ExpireCommand,
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
  private async executeCommand(userInput: string, currentUser: IUser, currentChatKey: IChatKey): Promise<boolean> {
    // split the user input into the command and the arguments
    const callString: string = splitString(userInput)[0].slice(1);
    const callArguments: string[] = splitString(userInput).slice(1);

    await this.databaseModel.addChatMessage(userInput, currentChatKey.id, currentUser.id, currentUser.id);

    for (let i = 0; i < this.commands.length; i++) {
      const command = this.commands[i];
      console.log(command.callString, callString);

      if (command.callString === callString) {
        // a command was found -> execute it
        // console.log("command found");
        let answerLines: string[];

        // check if user is allowed to execute the command
        if (currentUser.accessLevel >= command.minimumAccessLevel) {
          answerLines = await command.execute(callArguments, currentUser, currentChatKey.id);
        } else {
          answerLines = ["Error: Not allowed to execute this command!"];
        }

        // check if the command was executed successfully (If this is not the case, command.execute returns an empty array.)
        if (answerLines.length === 0 || answerLines === undefined) {
          // no answer -> command was not executed successfully
          // adding the Help Text in the DB to display in the Chat
          this.databaseModel.addChatMessage(command.helpText, currentChatKey.id, SystemUser.SYSTEM, currentUser.id);
          return false;
        } else {

          console.log(answerLines);

          // create a message for each line of the answer
          for (let i = 0; i < answerLines.length; i++) {
            await this.databaseModel.addChatMessage(answerLines[i], currentChatKey.id, SystemUser.SYSTEM, currentUser.id);
          }

          // console.log("Command executed successfully.");

          return true; // answer -> command was executed successfully
        }
      }
    }

    // No match was fund
    // console.log("No command /" + callString + " found");
    this.databaseModel.addChatMessage('No Command /' + callString + ' found', currentChatKey.id, SystemUser.SYSTEM, currentUser.id);

    return false; // command was not found
  }

  //#endregion

  //#region Token Methods

  /**
  * This method validates a given token with the current key.
  * @param {string} token Token to validate
  * @returns {boolean} True if the token is valid, false if not
  */
  public isTokenValid(token: string): boolean {
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
  public async isUserTokenValid(token: string): Promise<boolean> {
    if (this.isTokenValid(token) && await this.handleUserAlreadyExists(this.getUsernameFromToken(token))) {
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
  public getUsernameFromToken(token: string): string {
    try {
      let data = jwt.decode(token);
      if (typeof data === "object" && data !== null) {
        return data.username;
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
  public getIsAdminFromToken(token: string): boolean {
    try {
      let data = jwt.decode(token);
      if (typeof data === "object" && data !== null) {
        return data.isAdmin;
      }
    } catch (error) {

    }
    return false;
  }

  //#endregion

  //#region Password Methods

  /**
  * This method checks a password for requirements
  * @param {string} password password to check
  * @returns {boolean} true if the password meets the requirements, false if not
  */
  public isPasswordValid(password: string): boolean {
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
  private async hashPassword(password: string): Promise<string> {
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
  private async checkPassword(clearPassword: string, hashedpassword: string): Promise<boolean> {
    return await bcrypt.compare(clearPassword, hashedpassword);
  }

  //#endregion

  //#region User Methods

  /**
  * This method changes the password from the current user
  * @param {string} token Token to extract username from
  * @param {string} oldPassword contains the old User Password
  * @param {string} newPassword contains the new User Password
  * @returns {Promise<boolean>} if password was changed -> return true
  */
  public async handleChangeUserPassword(token: string, oldPassword: string, newPassword: string): Promise<boolean> {
    if (!this.isTokenValid(token)) {
      return false;
    }

    const user: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(token)))[0];

    if (user === undefined) {
      return false;
    }

    if (this.isPasswordValid(newPassword) && await this.checkPassword(oldPassword, user.hashedPassword)) {
      const newHashedPassword: string = await this.hashPassword(newPassword);
      return this.databaseModel.evaluateSuccess(await this.databaseModel.changeUserPassword(newHashedPassword, user.id));
    }

    return false;
  }

  /**
  * This method removes a target user from the database
  * @param {string} userToken user token to verificate delete process
  * @param {string} usernameToDelete username of user to delete
  * @returns {Promise<boolean>} true if user was deleted, false if not
  */
  public async handleDeleteUser(userToken: string, usernameToDelete: string): Promise<boolean> {
    if (!await this.isUserTokenValid(userToken)) {
      return false;
    }

    const userTokenName = this.getUsernameFromToken(userToken);

    // check whether an admin wants to delete a user or the user wants to delete itselfe
    if (userTokenName !== usernameToDelete && !this.getIsAdminFromToken(userToken)) {
      return false;
    }

    const targetUser: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, usernameToDelete))[0];

    if (targetUser === undefined) {
      return false;
    }

    return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteUser(targetUser.id));
  }

  /** 
   * This function is used to demote a user
   */
   public async handleUpdateUserAccessLevel(token: string, nameToPromote: string, proDemote: ProDemote): Promise<boolean> {
    if (await this.isUserTokenValid(token) && this.getIsAdminFromToken(token)) {
      const updateUser: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, nameToPromote))[0];
      if (updateUser === undefined) {
        return false;
      }
      if (proDemote === ProDemote.PROMOTE && updateUser.accessLevel < (AccessLevel.MAX_LEVEL - 1)) {
        return this.databaseModel.evaluateSuccess(await this.databaseModel.updateUserAccessLevel(updateUser.accessLevel + 1, updateUser.id));
      } else if (proDemote === ProDemote.DEMOTE && updateUser.accessLevel > 0) {
        return this.databaseModel.evaluateSuccess(await this.databaseModel.updateUserAccessLevel(updateUser.accessLevel - 1, updateUser.id));
      }
    }
    return false;
  }

  /**
   * This function is used to fetch all Users from the Database
   * @param token 
   * @returns Array of all IUsers
   */
  public async handleGetAllUsers(token: string): Promise<IUser[]> {
    if (await this.isUserTokenValid(token) && this.getIsAdminFromToken(token)) {
      return this.databaseModel.getIUserFromResponse(await this.databaseModel.fetchAllUsersAlphabeticalAndAccess());
    }
    return [];
  }

  /**
  * This method logs in a user if the given credentials are valid.
  * @param {string} username Username to log in
  * @param {string} password Password for the given username
  * @returns {Promise<string>} Signed token with username if login was successfull, empty string if not
  */
  public async handleLoginUser(username: string, password: string): Promise<string> {
    const user: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, username))[0];

    if (user === undefined) {
      return "";
    }

    if (await this.checkPassword(password, user.hashedPassword)) {
      const token: string = jwt.sign({
        username: username,
        isAdmin: (user.accessLevel === AccessLevel.ADMIN)
      }, BackEndController.KEY, { expiresIn: '1 day' });
      return token;
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
  public async handleRegisterUser(username: string, password: string, accessLevel: AccessLevel = AccessLevel.USER): Promise<string> {
    if (!await this.handleUserAlreadyExists(username)) {
      let returnString: string = "";
      const vUsernameValid: boolean = this.isUsernameValid(username);
      const vPasswordValid: boolean = this.isPasswordValid(password);
      if (!vUsernameValid && !vPasswordValid) {
        returnString = "error_username_password";
      }
      else if (!vPasswordValid) {
        returnString = "error_password";
      }
      else if (!vUsernameValid) {
        returnString = "error_username";
      }
      else if (vUsernameValid && vPasswordValid) {
        const hashedPassword = await this.hashPassword(password);

        if (this.databaseModel.evaluateSuccess(await this.databaseModel.addUser(username, hashedPassword, accessLevel))) {
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
   * This function is used to reset the password of a user
   */
  public async handleResetUserPassword(token: string, name: string): Promise<boolean> {
    const userIsValid: boolean = await this.isUserTokenValid(token) && this.getIsAdminFromToken(token);

    if (!userIsValid) {
      return false;
    }

    const resetUser: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, name))[0];

    if (resetUser === undefined) {
      return false;
    }

    const hashedResetPassword = await this.hashPassword(resetUser.name);
    console.log("Das Passwort wird jetzt zurückgesetzt auf " + resetUser.name + "!!");

    return this.databaseModel.evaluateSuccess(await this.databaseModel.changeUserPassword(hashedResetPassword, resetUser.id));
  }

  public async handleUserAlreadyExists(username: string): Promise<boolean> {
    return this.databaseModel.evaluateSuccess(await this.databaseModel.selectUserTable(undefined, username));
  }

  /**
  * This method checks a username for requirements
  * @param {string} username username to check
  * @returns {boolean} true if the username meets the requirements, false if not
  */
  public isUsernameValid(username: string): boolean {
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

  //#endregion

  //#region ChatKey Methods

  public async handleAddCustomChatKey(userToken: string, keyword: string): Promise<boolean> {
    if (await this.isUserTokenValid(userToken) && this.getIsAdminFromToken(userToken)) {
      return await this.addChatKey(keyword);
    }
    return false;
  }

  public async handleChangeChatKeyExpirationDate(token: string, chatKeyID: number, newExpirationDate: Date): Promise<boolean> {
    if (await this.isUserTokenValid(token) && this.getIsAdminFromToken(token)) {
      return this.databaseModel.evaluateSuccess(await this.databaseModel.changeChatKeyExpirationDate(chatKeyID, newExpirationDate));
    }
    return false;    
  }

  public async handleDeleteOldChatKeys(): Promise<boolean> {
    const currentDate = new Date();
    return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteChatKey(undefined, undefined, currentDate, true));
  }

  public async handleDeleteChatKey(userToken: string, chatKeyID: number): Promise<boolean> {
    if (await this.isUserTokenValid(userToken) && this.getIsAdminFromToken(userToken)) {
      return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteChatKey(chatKeyID));
    }
    return false;
  }

  public async handleDoesChatKeyExist(chatKey: string): Promise<boolean> {
    return this.databaseModel.evaluateSuccess(await this.databaseModel.selectChatKeyTable(undefined, chatKey));
  }

  public async handleGenerateChatKey(): Promise<string> {
    const keyword = getThreeWords();
    console.log(keyword)
    if (await this.addChatKey(keyword)) {
      console.log("Test")
      return keyword;
    }
    return "";
  }

  /**
  * This function is used to fetch all ChatKeys from the Database
  * @param token 
  * @returns Array of all IChatKeys
  */
  public async handleGetAllChatKeys(token: string): Promise<IChatKey[]> {
    // delete all expired chatKeys
    await this.handleDeleteOldChatKeys();

    if (await this.isUserTokenValid(token) && this.getIsAdminFromToken(token)) {
      return this.databaseModel.getIChatKeyFromResponse(await this.databaseModel.selectChatKeyTable());
    }
    return [];
  }

  /** 
  * API function to add a Chat Key to the database 
  * @param {string} chatKey the Id of the new Chatroom
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatKey was added
  */
  public async addChatKey(chatKey: string): Promise<boolean> {
    const chatKeyExists:boolean = this.databaseModel.evaluateSuccess(await this.databaseModel.selectChatKeyTable(undefined, chatKey))
  
    if (chatKeyExists || chatKey.replace(/\s/g, "") === "") {
      return false;
    }

    const expirationDate = new Date();
    // currentDate + 1 Day = ExpirationDate
    expirationDate.setDate(expirationDate.getDate() + 1);
    expirationDate.setHours(expirationDate.getHours() + 1);
    // console.log("Chat Key expires: " + expirationDate);
  
    return this.databaseModel.evaluateSuccess(await this.databaseModel.addChatKey(chatKey, expirationDate));
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
   public async handleGetChatMessages(token: string, keyword: string, lastMessageID: number): Promise<IFChatMessage[]> {
    if (!this.isTokenValid(token)) {
      return [];
    }

    const user: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(token)))[0];

    if (user === undefined) {
      return [];
    }

    const chatKey: IChatKey = this.databaseModel.getIChatKeyFromResponse(await this.databaseModel.selectChatKeyTable(undefined, keyword))[0];

    if (chatKey === undefined) {
      return [];
    }

    // Messages: targetuser = targetID, targetUser = 0, chatkeyID, setLastMessageID
    const messageTargetUser: IChatMessage[] = this.databaseModel.getIChatMessageFromResponse(await this.databaseModel.selectChatMessageTable(lastMessageID, chatKey.id, undefined, user.id, undefined, undefined, true));
    const messageTargetZero: IChatMessage[] = this.databaseModel.getIChatMessageFromResponse(await this.databaseModel.selectChatMessageTable(lastMessageID, chatKey.id, undefined, SystemUser.BROADCAST, undefined, undefined, true));
    const allMessages: IChatMessage[] = messageTargetUser.concat(messageTargetZero);

    allMessages.sort((a, b) => a.id - b.id)

    // Map allMessages to IFchatMessage[]
    const allUsers: IUser[] = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable());

    const allFChatMessages: IFChatMessage[] = allMessages.map(message => ({
      id: message.id,
      username: allUsers.find(user => user.id === message.userID)?.name || "",
      dateSend: message.dateSend,
      message: message.message,
    }))

    return allFChatMessages;
  };

  /**
   * API function to add a join/leave chat message to the database
   * @param {string} userToken the token of the user
   * @param {string} chatKey the chatKey of the chat
   * @param {string} joinOrLeave "join" or "leave"
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the message was added
   */
   public async handleJoinLeaveRoomMessage(userToken: string, keyword: string, joinOrLeave: string): Promise<boolean> {
    // verify if user is valid
    if (!this.isTokenValid(userToken)) {
      return false;
    }

    const user: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(userToken)))[0];

    if (user === undefined) {
      return false;
    }

    // get the chatKey
    const chatKey: IChatKey = this.databaseModel.getIChatKeyFromResponse(await this.databaseModel.selectChatKeyTable(undefined, keyword))[0];
    
    if (chatKey === undefined) {
      return false;
    }

    // send the message to the chatroom
    if (joinOrLeave === "join") {
      return await this.addChatMessage(user.name + " joined the chatroom", chatKey.id, SystemUser.SYSTEM);
    } else if (joinOrLeave === "leave") {
      return await this.addChatMessage(user.name + " left the chatroom", chatKey.id, SystemUser.SYSTEM);
    } else {
      return false;
    }
  }

  /** 
  * //TODO adding the cmd messages in the executeCommand Function
  * API function to handle a Chat Message
  * @param {string} message the message of the user
  * @param {number} chatKeyId the chatKeyId of the Chatroom
  * @param {string} userToken the token from the logged in user
  * @param {number} userId the Id of the User
  * @returns {Promise<boolean>} a promise that resolves to an boolean that the command or message was executed succesfully.
  */
  public async handleSaveChatMessage(message: string, keyword: string, userToken: string): Promise<boolean> {
    if (message.replace(/\s/g, "") === "") {
      return false;
    }

    const chatKey: IChatKey = this.databaseModel.getIChatKeyFromResponse(await this.databaseModel.selectChatKeyTable(undefined, keyword))[0];

    if (chatKey === undefined) {
      return false;
    }

    if(!await this.isUserTokenValid(userToken)) {
      return false;
    }

    const user: IUser = this.databaseModel.getIUserFromResponse(await this.databaseModel.selectUserTable(undefined, this.getUsernameFromToken(userToken)))[0]

    if (user === undefined) {
      return false;
    }

    if (message[0] === "/") {
      return await this.executeCommand(message, user, chatKey);
    }
    else {
      return await this.addChatMessage(message, chatKey.id, user.id);
    }
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
  public async addChatMessage(message: string, chatKeyId: number, userId: number, targetUserId: number = SystemUser.BROADCAST): Promise<boolean> {
    if (this.databaseModel.evaluateSuccess(await this.databaseModel.selectChatKeyTable(chatKeyId))) {
      console.log("UserID: " + targetUserId);
      return this.databaseModel.evaluateSuccess(await this.databaseModel.addChatMessage(message, chatKeyId, userId, targetUserId));
    }
    return false;
  };

  //#endregion

  //#region Ticket Methods

  /**
  * This function is used to change the status of a ticket from to-do to solved
  * NOTE -- This function only gives feedback inside the console, not the browser!
  * @param ticketToChange The ID of the ticket, that should be changed
  * 
  * @returns boolean - true if ticked was sucessfully changed - false if not
  */
  public async handleChangeTicketSolvedState(currentToken: string, ticketToChange: number, currentState: boolean): Promise<boolean> {
    if (await this.isUserTokenValid(currentToken) && this.getIsAdminFromToken(currentToken)) {
      return this.databaseModel.evaluateSuccess(await this.databaseModel.changeTicketSolvedState(ticketToChange, !currentState));
    }
    return false;
  }

  /**
   * This function is used to fetch all Tickets from the Database
   * @param token 
   * @returns Array of all IBugTickets
   */
  public async handleGetAllTickets(token: string): Promise<IBugTicket[]> {
    let allTickets: IBugTicket[] = [];
    // check if user is valid
    if (await this.isUserTokenValid(token) && this.getIsAdminFromToken(token)) {
      return this.databaseModel.getIBugTicketFromResponse(await this.databaseModel.selectTicketTable());
    }
    return [];
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
  public async handleChangeSurveyExpirationDate(token: string, surveyID: number, newExpirationDate: Date): Promise<boolean> {
    if (await this.isUserTokenValid(token) && this.getIsAdminFromToken(token)) {
      return this.databaseModel.evaluateSuccess(await this.databaseModel.changeSurveyExpirationDate(surveyID, newExpirationDate));
    }
    return false;
  }

  /**
   * deletes a survey inside supabase
   * @param userToken 
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
   public async handleDeleteSurvey(userToken: string, surveyIDToDelete: number): Promise<boolean> {
    if (await this.isUserTokenValid(userToken) && this.getIsAdminFromToken(userToken)) {
      return this.databaseModel.evaluateSuccess(await this.databaseModel.deleteSurvey(surveyIDToDelete));
    }
    return false;
  }

  public async handleGetAllSurveys(adminToken: string): Promise<ISurvey[]> {
    if(await this.isUserTokenValid(adminToken) && this.getIsAdminFromToken(adminToken)) {
      return this.databaseModel.getISurveyFromResponse(await this.databaseModel.selectSurveyTable());
    }
    return [];
  }

  /**
  * This method returns the current state of a survey for the given surveyID.
  * @param {number} surveyID the surveyID of the survey 
  * @returns {Promise<ISurvey>} the survey object containing all information about the survey and its status
  */
   public async getSurveyState(surveyID: number, chatKeyID: number): Promise<ISurveyState | null> {
    const survey: ISurvey = this.databaseModel.getISurveyFromResponse(await this.databaseModel.selectSurveyTable(surveyID, undefined, undefined, undefined, undefined, chatKeyID))[0];

    if (survey === undefined) {
      return null;
    }

    const surveyOptions: ISurveyOption[] = this.databaseModel.getISurveyOptionFromResponse(await this.databaseModel.selectSurveyOptionTable(undefined, surveyID));

    const surveyVotes: ISurveyVote[] = this.databaseModel.getISurveyVoteFromResponse(await this.databaseModel.selectSurveyVoteTable(surveyID));

    // assemble the survey object
    const surveyState: ISurveyState = {
      survey: survey,
      options: surveyOptions.map(option => {
        let countVotes = 0;
        if (surveyVotes !== null && surveyVotes.length > 0) {
          countVotes = surveyVotes.filter(vote => vote.optionID === option.id).length
        }
        return {
          option: option,
          votes: countVotes
        };
      })
    }

    return surveyState;
  }

  /**
  * This function is used to add a new vote for a survey option to the database.
  * @param voteToAdd the vote object to add to the database
  * @returns {Promise<ISurveyVote>} the vote object containing all information (with the added voteID)
  */
   public async addNewVote(voteToAdd: ISurveyVote): Promise<boolean> {
    // check if survey is still open
    const isExpired: boolean = await this.isSurveyExpired(voteToAdd.surveyID);

    if (isExpired) {
      return false;
    }

    // check if the survey and the option exist

    const optionExists: boolean = this.databaseModel.evaluateSuccess(await this.databaseModel.selectSurveyOptionTable(voteToAdd.optionID, voteToAdd.surveyID));

    if (!optionExists) {
      return false;
    }

    // fetch the supabase database
    const addedVoteSuccessfully = this.databaseModel.evaluateSuccess(await this.databaseModel.addSurveyVote(voteToAdd));

    return addedVoteSuccessfully;
  }

  public async isSurveyExpired(surveyID: number): Promise<boolean> {
    const survey = this.databaseModel.getISurveyFromResponse(await this.databaseModel.selectSurveyTable(surveyID))[0];

    if (survey === undefined) {
      return false;
    }

    return new Date(survey.expirationDate) < new Date();
  }

  //#endregion
}