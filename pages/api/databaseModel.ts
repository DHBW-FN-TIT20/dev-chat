//#region Imports

import { createClient, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { IChatKey, IChatMessage, ISurvey, ISurveyVote, IUser, IBugTicket, ISurveyOption } from '../../public/interfaces';

//#endregion

/**
 * This is the connection to the supabase database.
 * The methods of the class are used to get/post data from/to the database.
 * @category API
 */
export class DatabaseModel {

  //#region Private Variables
  private static CLIENT: SupabaseClient;
  //#endregion

  //#region Constructor
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    DatabaseModel.CLIENT = createClient(supabaseUrl, supabaseKey);
  }

  //#endregion

  //#region Universal Methods

  evaluateSuccess(dbResponse: PostgrestResponse<any>): boolean {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log("evaluateSuccess: " + dbResponse.error)
      return false;
    }
    return true;
  }

  //#endregion

  //#region User Methods

  getIUserFromResponse(dbResponse: PostgrestResponse<IUser>): IUser[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allUsers: IUser[] = [];

    for (const user of dbResponse.data) {
      allUsers.push({ id: user.id, name: user.name, hashedPassword: user.hashedPassword, accessLevel: user.accessLevel })
    }
    return allUsers;
  }

  /**
   * This is a universal select function for the user database
   * @param userID Filter userID
   * @param username Filter username
   * @param password Filter password (hash)
   * @param accessLevel Filter accessLevel
   * @returns DB result as list of IUser objects
   */
  async selectUserTable(userID?: number, username?: string, hashedPassword?: string, accessLevel?: number): Promise<PostgrestResponse<IUser>> {
    let idColumnName = "";
    let usernameColumnName = "";
    let passwordColumnName = "";
    let accessLevelColumnName = "";

    if (!(userID === undefined) && !isNaN(userID)) idColumnName = "id";
    if (!(username === undefined)) usernameColumnName = "name";
    if (!(hashedPassword === undefined)) passwordColumnName = "hashedPassword";
    if (!(accessLevel === undefined) && !isNaN(accessLevel)) accessLevelColumnName = "accessLevel";

    const userResponse = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .eq(idColumnName, userID)
      .eq(usernameColumnName, username)
      .eq(passwordColumnName, hashedPassword)
      .eq(accessLevelColumnName, accessLevel);

    return userResponse;
  }

  /**
   * This function is used to fetch all Users from the Database
   * @param token 
   * @returns Array of all IUsers
   */
  async fetchAllUsersAlphabeticalAndAccess(): Promise<PostgrestResponse<IUser>> {
    const userResponse = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .order("accessLevel", { ascending: false })
      .order("name", { ascending: true })

    return userResponse;
  }

  /**
  * API function to register a user
  * @param {string} user username to register
  * @param {string} password password for the user
  * @param {number} accessLevel access level for the user
  * @returns {Promise<string>} true if registration was successfull, error Message if not
  */
  public async addUser(username: string, hashedPassword: string, accessLevel: number = 0): Promise<PostgrestResponse<IUser>> {
    const addedUser = await DatabaseModel.CLIENT
      .from('User')
      .insert([
        { name: username, hashedPassword: hashedPassword, accessLevel: accessLevel },
      ]);

    return addedUser;
  }

  /** 
  * This function is used to reset the password of a user
  */
  public async changeUserPassword(newHashedPassword: string, userID: number): Promise<PostgrestResponse<IUser>> {
    const updatedUser = await DatabaseModel.CLIENT
      .from('User')
      .update({ hashedPassword: newHashedPassword })
      .eq('id', userID);

    return updatedUser;
  }

  /**
   * API function to update User Access Level
   * @param accessLevel 
   * @param userToUpdate 
   * @returns 
   */
  public async updateUserAccessLevel(accessLevel: number, userID: number): Promise<PostgrestResponse<IUser>> {
    const updatedUser = await DatabaseModel.CLIENT
      .from('User')
      .update({ accessLevel: accessLevel })
      .eq('id', userID);

    return updatedUser;
  }

  /**
   * This method removes a target user from the database
   * @param {string} userToken user token to verificate delete process
   * @param {string} usernameToDelete username of user to delete
   * @returns {Promise<boolean>} true if user was deleted, false if not
   */
  public async deleteUser(targetUserID: number): Promise<PostgrestResponse<IUser>> {
    const deletedUser = await DatabaseModel.CLIENT
      .from('User')
      .delete()
      .match({ 'id': targetUserID });

    return deletedUser;
  }

  //#endregion

  //#region ChatKey Methods

  getIChatKeyFromResponse(dbResponse: PostgrestResponse<IChatKey>): IChatKey[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allChatKeys: IChatKey[] = [];

    for (const chatKey of dbResponse.data) {
      allChatKeys.push({ id: chatKey.id, keyword: chatKey.keyword, expirationDate: new Date(chatKey.expirationDate) })
    }

    return allChatKeys;
  }

  /**
  * This function is used to fetch all ChatKeys from the Database
  * @param token 
  * @returns Array of all IChatKeys
  */
   public async selectChatKeyTable(id?: number, keyword?: string, expirationDate?: Date): Promise<PostgrestResponse<IChatKey>> {
    let idColumnName = "";
    let keywordColumnName = "";
    let expirationDateColumnName = "";

    if (!(id === undefined) && !isNaN(id)) idColumnName = "id";
    if (!(keyword === undefined)) keywordColumnName = "keyword";
    if (!(expirationDate === undefined)) expirationDateColumnName = "expirationDate";

    const chatKeyResponse = await DatabaseModel.CLIENT
      .from('ChatKey')
      .select()
      .eq(idColumnName, id)
      .eq(keywordColumnName, keyword)
      .eq(expirationDateColumnName, expirationDate)
      .order('id', { ascending: true });

    return chatKeyResponse;
  }

  /** 
  * API function to add a Chat Key to the database 
  * @param {string} chatKey the Id of the new Chatroom
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatKey was added
  */
   public async addChatKey(keyword: string, expirationDate: Date): Promise<PostgrestResponse<IChatKey>> {
    const addedUser = await DatabaseModel.CLIENT
      .from('ChatKey')
      .insert([
        { keyword: keyword, expirationDate: expirationDate },
      ]);
    
    return addedUser;
  };

  public async changeChatKeyExpirationDate(chatKeyID: number, expirationDate: Date): Promise<PostgrestResponse<IChatKey>> {
    const updatedChatKey = await DatabaseModel.CLIENT
      .from('ChatKey')
      .update({ 'expirationDate': expirationDate })
      .eq('id', chatKeyID)

    return updatedChatKey;
  }

  public async deleteChatKey(id?: number, keyword?: string, expirationDate?: Date, lowerThan: boolean = false): Promise<PostgrestResponse<IChatKey>> {
    let idColumnName = "";
    let keywordColumnName = "";
    let expirationDateColumnName = "";
    let lowerExpirationDateColumnName = "";

    if (!(id === undefined) && !isNaN(id)) idColumnName = "id";
    if (!(keyword === undefined)) keywordColumnName = "keyword";
    if (!(expirationDate === undefined) && !lowerThan) expirationDateColumnName = "expirationDate";
    if (!(expirationDate === undefined) && lowerThan) lowerExpirationDateColumnName = "expirationDate";

    const deletedUser = await DatabaseModel.CLIENT
      .from('ChatKey')
      .delete()
      .eq(idColumnName, id)
      .eq(keywordColumnName, keyword)
      .eq(expirationDateColumnName, expirationDate)
      .lt(lowerExpirationDateColumnName, expirationDate?.toISOString().toLocaleLowerCase());

    return deletedUser;
  }

  //#endregion

  //#region Chat Methods

  getIChatMessageFromResponse(dbResponse: PostgrestResponse<IChatMessage>): IChatMessage[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      // console.log(dbResponse.error)
      return [];
    }

    const allChatMessages: IChatMessage[] = [];

    for (const chatMessage of dbResponse.data) {
      allChatMessages.push({ 
        id: chatMessage.id, 
        chatKeyID: chatMessage.chatKeyID, 
        userID: chatMessage.userID,
        targetUserID: chatMessage.targetUserID,
        dateSend: new Date(chatMessage.dateSend),
        message: chatMessage.message })
    }

    return allChatMessages;
  }

  /** 
  * API function to get all chat messages from the database 
  * @param {string} token the token of the logged in user
  * @param {string} chatKey the chat key of the chat that is currently open
  * @param {number} lastMessageID the last message id point to start fetching new messages
  * @returns {Promise<IChatKeyMessage[]>}
  */
  public async selectChatMessageTable(id?: number, chatKeyID?: number, userID?: number, targetUserID?: number, dateSend?: Date, message?: string, greaterMessageID: boolean = false): Promise<PostgrestResponse<IChatMessage>> {
    let idColumnName = "";
    let chatKeyIDColumnName = "";
    let userIDColumnName = "";
    let targetIDColumnName = "";
    let dateSendColumnName = "";
    let messageColumnName = "";
    let greaterMessageIDColumnName = "";

    if (!(id === undefined) && !isNaN(id) && !greaterMessageID) idColumnName = "id";
    if (!(id === undefined) && !isNaN(id) && greaterMessageID) greaterMessageIDColumnName = "id";
    if (!(chatKeyID === undefined) && !isNaN(chatKeyID)) chatKeyIDColumnName = "chatKeyID";
    if (!(userID === undefined) && !isNaN(userID)) userIDColumnName = "userID";
    if (!(targetUserID === undefined) && !isNaN(targetUserID)) targetIDColumnName = "targetUserID";
    if (!(dateSend === undefined)) dateSendColumnName = "dateSend";
    if (!(message === undefined)) messageColumnName = "message";
    // Handle mapping userid username outside of call!!!
    const chatMessageResponse = await DatabaseModel.CLIENT
      .from('ChatMessage')
      .select()
      .eq(idColumnName, id)
      .eq(chatKeyIDColumnName, chatKeyID)
      .eq(userIDColumnName, userID)
      .eq(targetIDColumnName, targetUserID)
      .eq(dateSendColumnName, dateSend)
      .eq(messageColumnName, message)
      .gt(greaterMessageIDColumnName, id)
      .order('dateSend', { ascending: true });

    return chatMessageResponse;
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
  public async addChatMessage(message: string, chatKeyID: number, userID: number, targetUserID: number = 0): Promise<PostgrestResponse<IChatMessage>> {
    const addedMessages = await DatabaseModel.CLIENT
      .from('ChatMessage')
      .insert([
        { chatKeyID: chatKeyID, userID: userID, targetUserID: targetUserID, message: message },
      ]);

    return addedMessages;
  };

  //#endregion

  //#region Ticket Methods

  getIBugTicketFromResponse(dbResponse: PostgrestResponse<IBugTicket>): IBugTicket[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return [];
    }

    const allBugTickets: IBugTicket[] = [];

    for (const bugTicket of dbResponse.data) {
      allBugTickets.push({ 
        id: bugTicket.id,
        submitterID: bugTicket.submitterID,
        createDate: new Date(bugTicket.createDate),
        message: bugTicket.message,
        solved: bugTicket.solved })
    }

    return allBugTickets;
  }

  /**
   * This function is used to fetch all Tickets from the Database
   * @param token 
   * @returns Array of all IBugTickets
   */
  public async selectTicketTable(id?: number, submitterID?: number, createDate?: Date, message?: string, solved?: boolean): Promise<PostgrestResponse<IBugTicket>> {
    let idColumnName = "";
    let submitterIDColumnName = "";
    let createDateColumnName = "";
    let messageColumnName = "";
    let solvedColumnName = "";

    if (!(id === undefined) && !isNaN(id)) idColumnName = "id";
    if (!(submitterID === undefined) && !isNaN(submitterID)) submitterIDColumnName = "submitterID";
    if (!(createDate === undefined)) createDateColumnName = "createDate";
    if (!(message === undefined)) messageColumnName = "message";
    if (!(solved === undefined)) solvedColumnName = "solved";
    
    let ticketResponse = await DatabaseModel.CLIENT
      .from('Ticket')
      .select()
      .eq(idColumnName, id)
      .eq(submitterIDColumnName, submitterID)
      .eq(createDateColumnName, createDate)
      .eq(messageColumnName, message)
      .eq(solvedColumnName, solved)
      .order('id', { ascending: true })
      .order('solved', { ascending: true });

    return ticketResponse;
  }

  /**
  * This Method adds a new ticket to the supabase database
  * @param bugToReport the bug that should be reported (see report.ts)
  * @returns returns the ticket which was added to the supabase database
  */
   public async addTicket(submitterID: number, message: string): Promise<PostgrestResponse<IBugTicket>> {
    const addedTicket = await DatabaseModel.CLIENT
      .from('Ticket')
      .insert([
        { submitterID: submitterID, message: message },
      ])

    return addedTicket;
  }

  /**
  * This function is used to change the status of a ticket from to-do to solved
  * NOTE -- This function only gives feedback inside the console, not the browser!
  * @param ticketToChange The ID of the ticket, that should be changed
  * 
  * @returns boolean - true if ticked was sucessfully changed - false if not
  */
  public async changeTicketSolvedState(ticketID: number, newState: boolean): Promise<PostgrestResponse<IBugTicket>> {
    const updatedTicket = await DatabaseModel.CLIENT
      .from('Ticket')
      .update({ solved: newState })
      .eq('id', ticketID);

    return updatedTicket;
  }

  //#endregion

  //#region Survey Methods

  getISurveyFromResponse(dbResponse: PostgrestResponse<ISurvey>): ISurvey[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log(dbResponse.error)
      return [];
    }

    const allSurveys: ISurvey[] = [];

    for (const survey of dbResponse.data) {
      allSurveys.push({ 
        id: survey.id,
        name: survey.name,
        description: survey.description,
        expirationDate: new Date(survey.expirationDate),
        ownerID: survey.ownerID,
        chatKeyID: survey.chatKeyID })
    }

    return allSurveys;
  }

  getISurveyOptionFromResponse(dbResponse: PostgrestResponse<ISurveyOption>): ISurveyOption[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log(dbResponse.error)
      return [];
    }

    const allSurveyOptions: ISurveyOption[] = [];

    for (const option of dbResponse.data) {
      allSurveyOptions.push({ 
        id: option.id,
        surveyID: option.surveyID,
        name: option.name })
    }

    return allSurveyOptions;
  }

  getISurveyVoteFromResponse(dbResponse: PostgrestResponse<ISurveyVote>): ISurveyVote[] {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      console.log(dbResponse.error)
      return [];
    }

    const allSurveyVotes: ISurveyVote[] = [];

    for (const vote of dbResponse.data) {
      allSurveyVotes.push({ 
        surveyID: vote.surveyID,
        userID: vote.userID,
        optionID: vote.optionID })
    }

    return allSurveyVotes;
  }

  /**
  * This function is used to get all surveys (optionally only for one room).
  * @param {number | undefined} chatKeyID Optional chatKey filter argument
  * @returns {Promise<ISurvey[]>} all surveys in the database (for the chatKey)
  */
   public async selectSurveyTable(id?: number, name?: string, description?: string, expirationDate?: Date, ownerID?: number, chatKeyID?: number): Promise<PostgrestResponse<ISurvey>> {
    let idColumnName = "";
    let nameColumnName = "";
    let descriptionColumnName = "";
    let expirationDateColumnName = "";
    let ownerIDColumnName = "";
    let chatKeyIDColumnName = "";

    if (!(id === undefined) && !isNaN(id)) idColumnName = "id";
    if (!(name === undefined)) nameColumnName = "name";
    if (!(description === undefined)) descriptionColumnName = "description";
    if (!(expirationDate === undefined)) expirationDateColumnName = "expirationDate";
    if (!(ownerID === undefined) && !isNaN(ownerID)) ownerIDColumnName = "ownerID";
    if (!(chatKeyID === undefined) && !isNaN(chatKeyID)) chatKeyIDColumnName = "chatKeyID";

    const surveyResponse = await DatabaseModel.CLIENT
      .from('Survey')
      .select()
      .eq(idColumnName, id)
      .eq(nameColumnName, name)
      .eq(descriptionColumnName, description)
      .eq(expirationDateColumnName, expirationDate)
      .eq(ownerIDColumnName, ownerID)
      .eq(chatKeyIDColumnName, chatKeyID);
    
    return surveyResponse;
  }

  public async selectSurveyOptionTable(id?: number, surveyID?: number, name?: string): Promise<PostgrestResponse<ISurveyOption>> {
    let idColumnName = "";
    let surveyIDColumnName = "";
    let nameColumnName = "";

    if (!(id === undefined) && !isNaN(id)) idColumnName = "id";
    if (!(surveyID === undefined) && !isNaN(surveyID)) surveyIDColumnName = "surveyID";
    if (!(name === undefined)) nameColumnName = "name";

    const surveyOptionResponse = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .select()
      .eq(idColumnName, id)
      .eq(surveyIDColumnName, surveyID)
      .eq(nameColumnName, name);
    
    return surveyOptionResponse;
  }

  public async selectSurveyVoteTable(surveyID?: number, userID?: number, optionID?: number): Promise<PostgrestResponse<ISurveyVote>> {
    let surveyIDColumnName = "";
    let userIDColumnName = "";
    let optionIDColumnName = "";
    
    if (!(surveyID === undefined) && !isNaN(surveyID)) surveyIDColumnName = "surveyID";
    if (!(userID === undefined) && !isNaN(userID)) userIDColumnName = "userID";
    if (!(optionID === undefined) && !isNaN(optionID)) optionIDColumnName = "optionID";

    const surveyVoteResponse = await DatabaseModel.CLIENT
      .from('SurveyVote')
      .select()
      .eq(surveyIDColumnName, surveyID)
      .eq(userIDColumnName, userID)
      .eq(optionIDColumnName, optionID);

    return surveyVoteResponse;
  }

  public async addSurvey(name: string, description: string, expirationDate: Date, ownerID: number, chatKeyID: number): Promise<PostgrestResponse<ISurvey>> {
    const addedSurvey = await DatabaseModel.CLIENT
      .from('Survey')
      .insert([
        {
          name: name,
          description: description,
          expirationDate: expirationDate,
          ownerID: ownerID,
          chatKeyID: chatKeyID,
        },
      ]);
    
    return addedSurvey;
  }

  public async addSurveyOption(surveyOpitons: ISurveyOption[]): Promise<PostgrestResponse<ISurveyOption>> {
    const addedSurveyOptions = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .insert(surveyOpitons);

    return addedSurveyOptions;
  }

  public async addSurveyVote(vote: ISurveyVote): Promise<PostgrestResponse<ISurveyVote>> {
    const addedSurveyVote = await DatabaseModel.CLIENT
      .from('SurveyVote')
      .insert([
        { surveyID: vote.surveyID, userID: vote.userID, optionID: vote.optionID },
      ]);
    
    return addedSurveyVote;
  }

  /**
   * change the expiration Date of a certain survey inside supabase
   * @param token 
   * @param surveyID 
   * @param newExpirationDate 
   * @returns bool if sucessfull
   */
  public async changeSurveyExpirationDate(id: number, newExpirationDate: Date): Promise<PostgrestResponse<ISurvey>> {
    const updatedSurvey = await DatabaseModel.CLIENT
      .from('Survey')
      .update({ 'expirationDate': newExpirationDate })
      .eq('id', id);

    return updatedSurvey;
  }

  /**
   * deletes a survey inside supabase
   * @param userToken 
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
   public async deleteSurvey(id: number): Promise<PostgrestResponse<ISurvey>> {
    const deletedSurvey = await DatabaseModel.CLIENT
      .from('Survey')
      .delete()
      .eq('id', id);

    return deletedSurvey;
  }

  /**
   * deletes a survey inside supabase
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
  public async deleteSurveyOption(surveyID: number): Promise<PostgrestResponse<ISurveyOption>> {
    const deletedSurveyOption = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .delete()
      .eq('surveyID', surveyID);

    return deletedSurveyOption;
  }

  /**
   * function that deletes all votes of a certain survey
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
  public async deleteSurveyVote(surveyID: number): Promise<PostgrestResponse<ISurveyVote>> {
    const deletedSurveyVote = await DatabaseModel.CLIENT
      .from('SurveyVote')
      .delete()
      .eq('surveyID', surveyID);

    return deletedSurveyVote;
  }

  //#endregion
}