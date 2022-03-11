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

  /**
   * Checks if DB-Response is successfull
   * @param {PostgrestResponse<any>} dbResponse Response of database
   * @returns {boolean} if response is successfull
   */
  evaluateSuccess(dbResponse: PostgrestResponse<any>): boolean {
    if (dbResponse.data === null || dbResponse.error !== null || dbResponse.data.length === 0) {
      return false;
    }
    return true;
  }

  //#endregion

  //#region User Methods

  /**
   * Gets der IUserFromResponse
   * @param {PostgrestResponse<IUser>} dbResponse Response of database
   * @returns {IUser[]} Array of IUser objects
   */
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
   * @param {number} userID  Filter userID
   * @param {string} username Filter username
   * @param {string} hashedPassword Filter password (hash)
   * @param {number} accessLevel Filter accessLevel
   * @returns {Promise<PostgrestResponse<IUser>>} DB result as list of IUser objects
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
   * @returns {Promise<PostgrestResponse<IUser>>} DB result as list of IUser objects
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
   * @param {string} username username to register
   * @param {string} hashedPassword password for the user
   * @param {number} accessLevel access level for the user
   * @returns {Promise<PostgrestResponse<IUser>>} DB result as a IUser object
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
   * This function is used to change the password of a user
   * @param {string} newHashedPassword user token to verificate change password process
   * @param {number} userID userID of user to change password
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
   * @param {number} accessLevel access level to update
   * @returns {Promise<PostgrestResponse<IUser>>} DB result as a IUser object
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
   * @param {number} targetUserID userID of user to remove
   * @returns {Promise<PostgrestResponse<IUser>>} DB result as a IUser object
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

  /**
   * This is a function to get a chatKey from a the database response
   * @param {PostgrestResponse<IChatKey>} dbResponse A response of database
   * @returns {IChatKey[]} Array of IChatKey objects
   */
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
   * @param {number} id ChatKey ID to filter
   * @param {string} keyword ChatKey keyword to filter
   * @param {Date} expirationDate ChatKey expirationDate to filter 
   * @returns {Promise<PostgrestResponse<IChatKey>>} DB result as list of IChatKey objects
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
   * @param {string} keyword the Id of the new Chatroom
   * @param {Date} expirationDate the expiration date of the new Chatroom
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

  /**
   * This function is used to change the expirationDate of a ChatKey
   * @param {number} chatKeyID the id of the chatKey to delete
   * @param {Date} expirationDate the expiration date of the chatKey to delete
   * @returns {Promise<PostgrestResponse<IChatKey>>} DB result as a IChatKey object
   */
  public async changeChatKeyExpirationDate(chatKeyID: number, expirationDate: Date): Promise<PostgrestResponse<IChatKey>> {
    const updatedChatKey = await DatabaseModel.CLIENT
      .from('ChatKey')
      .update({ 'expirationDate': expirationDate })
      .eq('id', chatKeyID)

    return updatedChatKey;
  }

  /**
   * This function is used to delete a ChatKey from the database
   * @param {number} id the id of the chatKey to delete
   * @param {string} keyword the keyword of the chatKey to delete
   * @param {Date} expirationDate the expiration date of the chatKey to delete
   * @param {boolean} lowerThan if true -> filter the result to lowerThan expirationDate
   * @returns {Promise<PostgrestResponse<IChatKey>>}
   */
  public async deleteChatKey(id?: number, keyword?: string, expirationDate?: Date, lowerThan: boolean = false): Promise<PostgrestResponse<IChatKey>> {
    let idColumnName = "";
    let keywordColumnName = "";
    let expirationDateColumnName = "";
    let lowerExpirationDateColumnName = "";

    if (!(id === undefined) && !isNaN(id)) idColumnName = "id";
    if (!(keyword === undefined)) keywordColumnName = "keyword";
    if (!(expirationDate === undefined) && !lowerThan) expirationDateColumnName = "expirationDate";
    if (!(expirationDate === undefined) && lowerThan) lowerExpirationDateColumnName = "expirationDate";

    const deletedChatKey = await DatabaseModel.CLIENT
      .from('ChatKey')
      .delete()
      .eq(idColumnName, id)
      .eq(keywordColumnName, keyword)
      .eq(expirationDateColumnName, expirationDate)
      .lt(lowerExpirationDateColumnName, expirationDate?.toISOString().toLocaleLowerCase());

    return deletedChatKey;
  }

  //#endregion

  //#region Chat Methods

  /**
   * This is a function to get a chat message from a the database response
   * @param {PostgrestResponse<IChatMessage>} dbResponse A response of database with a IChatMessage object
   * @returns {IChatMessage[]} Array of IChatMessage objects
   */
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
   * API function to get chat messages from the database 
   * @param {number} id the id of the message to filter
   * @param {number} chatKeyID the chatKeyID of the message to filter
   * @param {number} userID the userID of the message to filter
   * @param {number} targetUserID the targetUserID of the message to filter
   * @param {Date} dateSend the dateSend of the message to filter
   * @param {string} message the message of the message to filter
   * @param {boolean} greaterMessageID if true -> filter the result to greater messageID
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
   * API function to add a Chat Message to the database 
   * @param {string} message the message of the user
   * @param {number} chatKeyID the chatKeyID of the chat to add the message to
   * @param {number} userID the userID of the message to add
   * @param {number} targetUserID the targetUserID of the message to add
   * @returns {Promise<PostgrestResponse<IChatMessage>>} a promise that resolves to an boolean that indicates if the message was added
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

  /**
   * This is a function to get a ticket from a the database response
   * @param {PostgrestResponse<IBugTicket>} dbResponse A response of database with a IBugTicket object
   * @returns {IBugTicket[]} Array of IBugTicket objects
   */
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
   * This function is used to fetch tickets from the Database
   * @param {number} id the id of the ticket to filter
   * @param {number} submitterID the submitterID of the ticket to filter
   * @param {Date} createDate the createDate of the ticket to filter
   * @param {string} message the message of the ticket to filter
   * @param {boolean} solved the solved of the ticket to filter
   * @returns {Promise<PostgrestResponse<IBugTicket>>} A promise that resolves to a database response with a IBugTicket object
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
   * @param {number} submitterID the submitterID of the ticket to add
   * @param {string} message the message of the ticket to add
   * @returns {Promise<PostgrestResponse<IBugTicket>>} A promise that resolves to a database response with a IBugTicket object
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
   * @param {number} ticketID the id of the ticket to change the status of
   * @param {boolean} newState the new status of the ticket
   * @returns {Promise<PostgrestResponse<IBugTicket>>} A promise that resolves to a database response with a IBugTicket object
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

  /**
   * This is a function to get a survey from a database response
   * @param {PostgrestResponse<ISurvey>} dbResponse A response of database with a ISurvey object
   * @returns {ISurvey[]} Array of ISurvey objects
   */
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

  /**
   * This function is used to get the survey options from a database response
   * @param {PostgrestResponse<ISurveyOption>} dbResponse A response of database with a ISurveyOption object
   * @returns {ISurveyOption[]} Array of ISurveyOption objects
   */
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

  /**
   * This function is used to get the survey votes from a database response
   * @param {PostgrestResponse<ISurveyVote>} dbResponse A response of database with a ISurveyVote object
   * @returns {ISurveyVote[]} Array of ISurveyVote objects
   */
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
   * This function is used to get a survey from the database
   * @param {number} id the id of the survey to get
   * @param {string} name the name of the survey to get
   * @param {string} description the description of the survey to get
   * @param {Date} expirationDate the expiration date of the survey to get
   * @param {number} ownerID the ownerID of the survey to get
   * @param {number} chatKeyID the chatKeyID of the survey to get
   * @returns {Promise<PostgrestResponse<ISurvey>>} A promise that resolves to a database response with a ISurvey object
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

  /**
   * This function is used to get a survey options from the database
   * @param {number} id the id of the survey option to get
   * @param {number} surveyID the surveyID of the survey option to get
   * @param {string} name the name of the survey option to get
   * @returns {Promise<PostgrestResponse<ISurveyOption>>} A promise that resolves to a database response with a ISurveyOption object
   */
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

  /**
   * This function is used to get a survey votes from the database
   * @param {number} surveyID the surveyID of the survey vote to get
   * @param {number} userID the userID of the survey vote to get
   * @param {number} optionID the optionID of the survey vote to get
   * @returns {Promise<PostgrestResponse<ISurveyVote>>} A promise that resolves to a database response with a ISurveyVote object
   */
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

  /**
   * This function is used to insert a survey into the database (name: string, description: string, expirationDate: Date, ownerID: number, chatKeyID: number): Promise<PostgrestResponse<ISurvey>>
   * @param {string} name the name of the survey to insert
   * @param {string} description the description of the survey to insert
   * @param {Date} expirationDate the expiration date of the survey to insert
   * @param {number} ownerID the ownerID of the owner of the survey to insert
   * @param {number} chatKeyID the chatKeyID of the survey to insert
   * @returns {Promise<PostgrestResponse<ISurvey>>} A promise that resolves to a database response with the added ISurvey object
   */
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

  /**
   * This function is used to insert a survey options into the database
   * @param {ISurveyOption[]} surveyOpitons the survey options to insert
   * @returns {Promise<PostgrestResponse<ISurveyOption>>} A promise that resolves to a database response with the added ISurveyOption object
   */
  public async addSurveyOption(surveyOpitons: ISurveyOption[]): Promise<PostgrestResponse<ISurveyOption>> {
    const addedSurveyOptions = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .insert(surveyOpitons);

    return addedSurveyOptions;
  }

  /**
   * This function is used to insert a survey vote into the database
   * @param {ISurveyVote} vote the survey vote to insert
   * @returns {Promise<PostgrestResponse<ISurveyVote>>} A promise that resolves to a database response with the added ISurveyVote object
   */
  public async addSurveyVote(vote: ISurveyVote): Promise<PostgrestResponse<ISurveyVote>> {
    const addedSurveyVote = await DatabaseModel.CLIENT
      .from('SurveyVote')
      .insert([
        { surveyID: vote.surveyID, userID: vote.userID, optionID: vote.optionID },
      ]);
    
    return addedSurveyVote;
  }

  /**
   * This function is used to change the expiration date of a survey
   * @param {number} id the id of the survey to change
   * @param {Date} newExpirationDate the new expiration date of the survey to change
   * @returns {Promise<PostgrestResponse<ISurvey>>} A promise that resolves to a database response with the changed ISurvey object
   */
  public async changeSurveyExpirationDate(id: number, newExpirationDate: Date): Promise<PostgrestResponse<ISurvey>> {
    const updatedSurvey = await DatabaseModel.CLIENT
      .from('Survey')
      .update({ 'expirationDate': newExpirationDate })
      .eq('id', id);

    return updatedSurvey;
  }

  /**
   * This function is used to delete a survey from the database
   * @param {number} id the id of the survey to delete
   * @returns {Promise<PostgrestResponse<ISurvey>>} A promise that resolves to a database response with the deleted ISurvey object
   */
   public async deleteSurvey(id: number): Promise<PostgrestResponse<ISurvey>> {
    const deletedSurvey = await DatabaseModel.CLIENT
      .from('Survey')
      .delete()
      .eq('id', id);

    return deletedSurvey;
  }

  /**
   * This function is used to delete a survey option from the database
   * @param {number} surveyID the surveyID of the survey option to delete
   * @returns {Promise<PostgrestResponse<ISurveyOption>>} A promise that resolves to a database response with the deleted ISurveyOption object
   */
  public async deleteSurveyOption(surveyID: number): Promise<PostgrestResponse<ISurveyOption>> {
    const deletedSurveyOption = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .delete()
      .eq('surveyID', surveyID);

    return deletedSurveyOption;
  }

  /**
   * This function is used to delete a survey vote from the database
   * @param {number} surveyID the surveyID of the survey vote to delete
   * @returns {Promise<PostgrestResponse<ISurveyVote>>} A promise that resolves to a database response with the deleted ISurveyVote object
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