//#region Imports

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IChatKey, IChatMessage, ISurvey, ISurveyState, ISurveyVote, IUser, IBugTicket } from '../../public/interfaces';

//#endregion

/**
 * This is the connection to the supabase database.
 * All the api routes should lead to this class.
 * The methods of the class are used to get/post data from/to the database.
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

  //#region User Methods

  /** 
  * This function is used to reset the password of a user
  */
  public resetPassword = async (hashedResetPassword: string, resetID: number): Promise<boolean> => {
    const UpdateStatus = await DatabaseModel.CLIENT
      .from('User')
      .update({ Password: hashedResetPassword })
      .eq('UserID', resetID);

    if (UpdateStatus.data === null || UpdateStatus.error !== null || UpdateStatus.data.length === 0) {
      console.log("Something went wrong while trying to reset the password!");
      return false;
    }
    return true;
  }

  /**
   * This function is used to fetch all Users from the Database
   * @param token 
   * @returns Array of all IUsers
   */
  public fetchAllUsers = async (): Promise<IUser[]> => {
    let allUsers: IUser[] = []
    let UserResponse = await DatabaseModel.CLIENT
      .from('User')
      .select('UserID,Username,AccessLevel')

    if (UserResponse.data === null || UserResponse.error !== null || UserResponse.data.length === 0) {
      console.log("Unknown Error, please contact support.")
      return allUsers;
    }
    allUsers = UserResponse.data.map(allUser => {
      return {
        id: allUser.UserID,
        name: allUser.Username,
        accessLevel: allUser.AccessLevel,
      }
    })
    return allUsers;
  }

  /**
  * This helper function is used to get the userID of a user by username
  * @param {string} username the username of the user
  * @returns {Promise<number>} the userID of the user
  */
  public getUserIDByUsername = async (username: string | undefined): Promise<number> => {
    // fetch the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .match({ Username: username });

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // user was not found -> return NaN
      return NaN;
    } else {
      // user was removed -> return true
      return data[0].UserID;
    }
  }

  /**
* This helper function is used to get the username of a user by userID
* @param {string} userID the id of the user
* @returns {Promise<number>} the username of the user
*/
  public getUsernameByUserID = async (userID: number | undefined): Promise<string | undefined> => {
    // fetch the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .select('Username')
      .eq('UserID', userID);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // user was not found -> return undefined
      return undefined;
    } else {
      return data[0].Username;
    }
  }

  /**
  * This method returns all user informations for the given username
  * @param username the username of the user
  * @returns {Promise<IUser>} the user object containing all information
  */
  public getIUserByUsername = async (username: string): Promise<IUser> => {
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .match({ Username: username });

    let user: IUser = {};
    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // user was not found -> return empty IUser
      return user;
    } else {
      // user was found -> return IUser
      user = { id: data[0].UserID, name: data[0].Username, hashedPassword: data[0].Password, accessLevel: data[0].AccessLevel };
      return user;
    }
  }


  /**
  * This method returns all user informations for the given userID 
  * @param {number} userID the userID of the user
  * @returns {Promise<IUser>} the user object containing all information
  */
  public getIUserByUserID = async (userID: number): Promise<IUser> => {
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .match({ UserID: userID });

    let user: IUser = {};
    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // user was not found -> return empty IUser
      return user;
    } else {
      // user was found -> return IUser
      user = { id: data[0].UserID, name: data[0].Username, hashedPassword: data[0].Password, accessLevel: data[0].AccessLevel };
      return user;
    }
  }

  /** 
  * API function to check if the username and the password are correct 
  * @param {string} username the username to check
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username already exists
  */
  public userAlreadyExists = async (username: string): Promise<boolean> => {

    // fetch the data from the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .select()
      .eq('Username', username);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // no users found -> user does not exist -> return false
      return false;
    } else {
      // user exists -> return true
      return true;
    }
  };

  /**
  * API function to register a user
  * @param {string} user username to register
  * @param {string} password password for the user
  * @param {number} accessLevel access level for the user
  * @returns {string} true if registration was successfull, error Message if not
  */
  public registerUser = async (username: string, hashedPassword: string, accessLevel: number = 0): Promise<string> => {
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .insert([
        { Username: username, Password: hashedPassword, "AccessLevel": accessLevel },
      ]);

    if (data === null || error !== null || data.length === 0) {
      return "False";
    }
    else {
      console.log("User registered:", username);
      return "True";
    }
  }

  /**
   * API function to update User Access Level
   * @param accessLevel 
   * @param userToUpdate 
   * @returns 
   */
  public updateUserAccessLevel = async (accessLevel: number, userToUpdate: number): Promise<boolean> => {
    const UpdateStatus = await DatabaseModel.CLIENT
      .from('User')
      .update({ AccessLevel: accessLevel })
      .eq('UserID', userToUpdate);

    if (UpdateStatus.data === null || UpdateStatus.error !== null || UpdateStatus.data.length === 0) {
      console.log("Something went wrong with the promotion!");
      return false;
    }
    return true;
  }

  /**
  * This method removes a target user from the database
  * @param {string} userToken user token to verificate delete process
  * @param {string} usernameToDelete username of user to delete
  * @returns {boolean} true if user was deleted, false if not
  */
  public deleteUser = async (targetUserId: number): Promise<boolean> => {
    // fetch the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .delete()
      .match({ 'UserID': targetUserId });

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // user was not removed -> return false
      return false;
    } else {
      // user was removed -> return true
      return true;
    }
  }

  /**
  * This method changes the password from the current user
  * @param {string} token Token to extract username from
  * @param {string} oldPassword contains the old User Password
  * @param {string} newPassword contains the new User Password
  * @returns {boolean} if password was changed -> return true
  */
  public changeUserPassword = async (currentUserID: number, newPassword: string): Promise<boolean> => {
    const { data, error } = await DatabaseModel.CLIENT
      .from('User')
      .update({ Password: newPassword })
      .eq('UserID', currentUserID);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // password was not change -> return false
      return false;
    } else {
      // password was changed -> return true
      return true;
    }
  }

  //#endregion

  //#region ChatKey Methods

  public changeChatKeyExpirationDate = async (chatKeyID: number | undefined, newExpirationDate: Date | null): Promise<boolean> => {
    const UpdateStatus = await DatabaseModel.CLIENT
      .from('ChatKey')
      .update({ 'ExpirationDate': newExpirationDate })
      .eq('ChatKeyID', chatKeyID)

    if (UpdateStatus.data === null || UpdateStatus.error !== null || UpdateStatus.data.length === 0) {
      console.log("Something went wrong while altering the table!");
      return false;
    }
    return true;
  }

  public deleteChatKey = async (chatKeyToDelete: number | undefined): Promise<boolean> => {
    // fetch the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatKey')
      .delete()
      .eq('ChatKeyID', chatKeyToDelete);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // chatKey was not removed -> return false
      return false;
    } else {
      // chatKey was removed -> return true
      return true;
    }
  }

  /**
  * This function is used to fetch all ChatKeys from the Database
  * @param token 
  * @returns {IChatKey} Array of all IChatKeys
  */
  public fetchAllChatKeys = async (): Promise<IChatKey[]> => {
    let allChatKeys: IChatKey[] = []
    let ChatKeyResponse = await DatabaseModel.CLIENT
      .from('ChatKey')
      .select('ChatKeyID,ChatKey,ExpirationDate')
      .order('ChatKeyID', { ascending: true })

    if (ChatKeyResponse.data === null || ChatKeyResponse.error !== null || ChatKeyResponse.data.length === 0) {
      console.log("No Chat Keys found!")
      return allChatKeys;
    }
    allChatKeys = ChatKeyResponse.data.map(allChat => {
      return {
        id: allChat.ChatKeyID,
        threeWord: allChat.ChatKey,
        expirationDate: allChat.ExpirationDate,
      }
    })
    return allChatKeys;
  }

  /**
  * API funciton to get the id of a threeword chatKey
  * @param {string} chatKey the threeword
  * @returns {number>} id of threeword
  */
  public getChatKeyID = async (chatKey: string): Promise<number> => {

    // fetch the data from the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatKey')
      .select()
      .eq('ChatKey', chatKey);

    if (data === null || error !== null || data.length === 0) {
      return NaN;
    }
    return data[0].ChatKeyID;
  };

  /** 
  * API function to update the current Chat Key ExpiratioNDate 
  * @param {number} chatKeyID the Id of the current Chatroom
  * @param {Date} newExpirationDate the new ExpirationDate
  * @returns {Promise<IChatKey>} a promise that resolves an IChatKey with the new ExpirationDate
  */
  public updateExpirationDateFromCurrentChatKey = async (chatKeyID: number, newExpirationDate: Date): Promise<IChatKey | null> => {
    let chatKey: IChatKey | null = null;

    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatKey')
      .update({ 'ExpirationDate': newExpirationDate })
      .eq('ChatKeyID', chatKeyID)

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // ChatKey was not updated -> return null
      return chatKey;
    } else {
      // ChatKey was updated -> return chatkey object with new expirationDate
      return await this.getChatKey(chatKeyID);
    }
  };

  /**
  * This function is used to get the current chat for the command /expire
  * @param {number} chatKeyID the Id of the current Chatroom
  * @returns {Promise<IChatKey>} to get the current chatKeyObject from the Database
  */
  public getChatKey = async (chatKeyID: number): Promise<IChatKey | null> => {
    let chatKey: IChatKey | null = null;

    let chatKeyToResponse = await DatabaseModel.CLIENT
      .from('ChatKey')
      .select()
      .eq('ChatKeyID', chatKeyID)

    if (chatKeyToResponse.data === null || chatKeyToResponse.error !== null || chatKeyToResponse.data.length === 0) {
      return chatKey;
    }

    chatKey = {
      id: chatKeyToResponse.data[0].ChatKeyID,
      threeWord: chatKeyToResponse.data[0].ChatKey,
      expirationDate: new Date(chatKeyToResponse.data[0].ExpirationDate),
    }
    return chatKey;
  }

  /** 
  * API function to add a Chat Key to the database 
  * @param {string} chatKey the Id of the new Chatroom
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatKey was added
  */
  public addChatKey = async (chatKey: string, expirationDate: Date): Promise<boolean> => {
    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatKey')
      .insert([
        { ChatKey: chatKey, ExpirationDate: expirationDate },
      ])
    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // ChatKey was not added -> return false
      return false;
    } else {
      // ChatKey was added -> return true
      return true;
    }
  };

  /** 
  * API function to check if the chatKey already exists
  * @param {string} chatKey the chatKey to check
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatKey already exists
  */
  public chatKeyAlreadyExists = async (chatKey: string): Promise<boolean> => {

    // fetch the data from the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatKey')
      .select()
      .eq('ChatKey', chatKey);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // no chatKey found -> chatKey does not exist -> return false
      return false;
    } else {
      // chatKey exists -> return true
      return true;
    }
  };

  /** 
  * API function to delete all old chat keys from the database // is always called, when going into Admin settings
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if old chat keys were deleted
  */
  public deleteOldChatKeys = async (): Promise<boolean> => {

    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatKey')
      .delete()
      .lt('ExpirationDate', ((new Date()).toISOString()).toLocaleLowerCase())

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // surveyOption was not removed -> return false
      return false;
    } else {
      // surveyOption was removed -> return true
      console.log("Old ChatKeys have been deleted successfully!");
      return true;
    }

    //Hier muss noch ggbfs. was geschrieben werden.
    if (error) {
      // console.error(error)
    }
    else {
      // console.log(data)
    }

    return false;
  };

  /** 
  * API function to check if the input ChatKey exists
  * @param {string} chatKey the chatKey to check
  * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatkey exists
  */
  public doesChatKeyExists = async (chatKey: string): Promise<boolean> => {

    // fetch the data from the supabase database
    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatKey')
      .select()
      .eq('ChatKey', chatKey);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // no chatkeys found -> chatkey does not exist -> return false
      return false;
    } else {
      // chatkey exists -> return true
      return true;
    }
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
  public getChatMessages = async (chatKeyID: number, filterString: string, lastMessageID: number): Promise<IChatMessage[]> => {
    let chatMessages: IChatMessage[] = [];

    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatMessage')
      .select(`
        DateSend,
        MessageID,
        Message,
        UserID ( Username )
      `)
      .eq('ChatKeyID', chatKeyID)
      .or(filterString)
      .gt('MessageID', lastMessageID)
      .order('DateSend', { ascending: true })

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // no messages found -> return empty array
      return [];
    } else {

      // map raw data on IChatMessage type
      data.forEach(element => {
        chatMessages.push({
          user: element.UserID.Username,
          date: new Date(element.DateSend),
          message: element.Message,
          id: element.MessageID
        });
      });

      return chatMessages;
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
  public addChatMessage = async (message: string, chatKeyId: number, userId: number, targetUserId: number = 0): Promise<boolean> => {
    const { data, error } = await DatabaseModel.CLIENT
      .from('ChatMessage')
      .insert([
        { ChatKeyID: chatKeyId, UserID: userId, TargetUserID: targetUserId, Message: message },
      ])

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // Message was not added -> return false
      return false;
    } else {
      // Message was added -> return true
      return true;
    }

  };

  //#endregion

  //#region Ticket Methods


  /**
   * This function is used to fetch all Tickets from the Database
   * @param token 
   * @returns Array of all IBugTickets
   */
  public fetchAllTickets = async (): Promise<IBugTicket[]> => {
    let allTickets: IBugTicket[] = []
    let TicketResponse = await DatabaseModel.CLIENT
      .from('Ticket')
      .select()

    if (TicketResponse.data === null || TicketResponse.error !== null || TicketResponse.data.length === 0) {
      console.log("Unknown Error, please contact support.")
      return allTickets;
    }
    allTickets = TicketResponse.data.map(allTicket => {
      return {
        id: allTicket.TicketID,
        submitter: allTicket.SubmitterID,
        date: allTicket.TicketCreateDate,
        message: allTicket.Message,
        solved: allTicket.Solved,
      }
    })
    return allTickets;
  }

  /**
  * This function is used to change the status of a ticket from to-do to solved
  * NOTE -- This function only gives feedback inside the console, not the browser!
  * @param ticketToChange The ID of the ticket, that should be changed
  * 
  * @returns boolean - true if ticked was sucessfully changed - false if not
  */
  public changeSolvedState = async (ticketToChange: number | undefined, currentState: boolean | undefined): Promise<boolean> => {
    const UpdateStatus = await DatabaseModel.CLIENT
      .from('Ticket')
      .update({ Solved: currentState })
      .eq('TicketID', ticketToChange)

    if (UpdateStatus.data === null || UpdateStatus.error !== null || UpdateStatus.data.length === 0) {
      console.log(UpdateStatus.error);
      return false;
    }
    return true;
  }

  /**
  * This Method adds a new ticket to the supabase database
  * @param bugToReport the bug that should be reported (see report.ts)
  * @returns returns the ticket which was added to the supabase database
  */
  public addNewTicket = async (bugToReport: IBugTicket): Promise<IBugTicket | null> => {
    let addedTicket: IBugTicket | null = null;
    // fetch the supabase database
    const TicketResponse = await DatabaseModel.CLIENT
      .from('Ticket')
      .insert([
        {
          SubmitterID: bugToReport.submitter.id,
          Message: bugToReport.message,
        },
      ])

    if (TicketResponse.data === null || TicketResponse.error !== null || TicketResponse.data.length === 0 || TicketResponse.data[0].TicketID === null || TicketResponse.data[0].TicketID === undefined) {
      return null;
    }

    addedTicket = {
      id: TicketResponse.data[0].TicketID,
      submitter: TicketResponse.data[0].SubmitterID,
      date: TicketResponse.data[0].TicketCreateDate,
      message: TicketResponse.data[0].Message,
      solved: TicketResponse.data[0].Solved,
    }

    const TicketID = TicketResponse.data[0].TicketID;

    return addedTicket;
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
  public changeSurveyExpirationDate = async (surveyID: number | undefined, newExpirationDate: Date | null): Promise<boolean> => {
    const UpdateStatus = await DatabaseModel.CLIENT
      .from('Survey')
      .update({ 'ExpirationDate': newExpirationDate })
      .eq('SurveyID', surveyID)

    if (UpdateStatus.data === null || UpdateStatus.error !== null || UpdateStatus.data.length === 0) {
      console.log("Something went wrong while altering the table!");
      console.log(UpdateStatus.error);
      return false;
    }
    return true;
  }

  /**
   * deletes a survey inside supabase
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
  public deleteSurveyOption = async (surveyIDToDelete: number | undefined): Promise<boolean> => {

    const { data, error } = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .delete()
      .eq('SurveyID', surveyIDToDelete);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // surveyOption was not removed -> return false
      return false;
    } else {
      // surveyOption was removed -> return true
      console.log("SurveyOption has been deleted successfully!");
      return true;
    }
  }

  /**
   * function that deletes all votes of a certain survey
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
  public deleteSurveyVote = async (surveyIDToDelete: number | undefined): Promise<boolean> => {

    const { data, error } = await DatabaseModel.CLIENT
      .from('SurveyVote')
      .delete()
      .eq('SurveyID', surveyIDToDelete);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // surveyVote was not removed -> return false
      return false;
    } else {
      // surveyVote was removed -> return true
      console.log("SurveyVote has been deleted successfully!");
      return true;
    }
  }

  /**
   * deletes a survey inside supabase
   * @param userToken 
   * @param surveyIDToDelete 
   * @returns bool if sucessfull
   */
  public deleteSurvey = async (surveyIDToDelete: number | undefined): Promise<boolean> => {
    const { data, error } = await DatabaseModel.CLIENT
      .from('Survey')
      .delete()
      .eq('SurveyID', surveyIDToDelete);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // survey was not removed -> return false
      console.log(error);
      return false;
    } else {
      // survey was removed -> return true
      console.log("Survey has been deleted successfully!");
      return true;
    }
  }

  /**
  * This method returns the current state of a survey for the given surveyID.
  * @param {number} surveyID the surveyID of the survey 
  * @returns {Promise<ISurvey>} the survey object containing all information about the survey and its status
  */
  public getCurrentSurveyState = async (surveyID: number, chatKeyID: number): Promise<ISurveyState | null> => {
    let survey: ISurveyState;

    let surveyResponse = await DatabaseModel.CLIENT
      .from('Survey')
      .select()
      .match({ SurveyID: surveyID, ChatKeyID: chatKeyID });

    if (surveyResponse.data === null || surveyResponse.error !== null || surveyResponse.data.length === 0) {
      return null;
    }

    let optionResponse = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .select()
      .match({ SurveyID: surveyID });

    if (optionResponse.data === null || optionResponse.error !== null) {
      return null;
    }

    let voteResponse = await DatabaseModel.CLIENT
      .from('SurveyVote')
      .select()
      .match({ SurveyID: surveyID });

    if (voteResponse.data === null || voteResponse.error !== null) {
      return null;
    }

    // assemble the survey object
    survey = {
      id: surveyResponse.data[0].SurveyID,
      name: surveyResponse.data[0].Name,
      description: surveyResponse.data[0].Description,
      expirationDate: new Date(surveyResponse.data[0].ExpirationDate),
      ownerID: surveyResponse.data[0].OwnerID,
      chatKeyID: surveyResponse.data[0].ChatKeyID,
      options: optionResponse.data.map(option => {
        let countVotes = 0;
        if (voteResponse.data !== null && voteResponse.data.length > 0) {
          countVotes = voteResponse.data.filter(vote => vote.OptionID === option.OptionID).length
        }
        return {
          option: {
            id: option.OptionID,
            name: option.OptionName,
          },
          votes: countVotes
        };
      })
    }

    return survey;
  }


  /**
  * This function is used to get all surveys (optionally only for one room).
  * @param {number | undefined} chatKeyID Optional chatKey filter argument
  * @returns {Promise<ISurvey[]>} all surveys in the database (for the chatKey)
  */
  public getAllSurveys = async (chatKeyID?: number): Promise<ISurvey[]> => {
    let surveys: ISurvey[] = [];

    let surveyResponse;

    if (chatKeyID === undefined) {
      surveyResponse = await DatabaseModel.CLIENT
        .from('Survey')
        .select();
    } else {
      surveyResponse = await DatabaseModel.CLIENT
        .from('Survey')
        .select()
        .match({ ChatKeyID: chatKeyID });
    }


    if (surveyResponse.data === null || surveyResponse.error !== null || surveyResponse.data.length === 0) {
      return surveys;
    }

    surveys = surveyResponse.data.map(survey => {
      return {
        id: survey.SurveyID,
        name: survey.Name,
        description: survey.Description,
        expirationDate: new Date(survey.ExpirationDate),
        ownerID: survey.OwnerID,
        chatKeyID: survey.ChatKeyID,
        options: []
      }
    })

    return surveys;
  }

  /**
  * This function is used to add a new survey to the database.
  * @param {ISurvey} surveyToAdd the survey object to add to the database
  * @returns {Promise<ISurvey>} the survey object containing all information (with the added surveyID)
  */
  public addNewSurvey = async (surveyToAdd: ISurvey): Promise<ISurvey | null> => {
    let addedSurvey: ISurvey | null = null;

    // fetch the supabase database
    const surveyResponse = await DatabaseModel.CLIENT
      .from('Survey')
      .insert([
        {
          Name: surveyToAdd.name,
          Description: surveyToAdd.description,
          ExpirationDate: new Date(surveyToAdd.expirationDate),
          OwnerID: surveyToAdd.ownerID,
          ChatKeyID: surveyToAdd.chatKeyID,
        },
      ])

    if (surveyResponse.data === null || surveyResponse.error !== null || surveyResponse.data.length === 0 || surveyResponse.data[0].SurveyID === null || surveyResponse.data[0].SurveyID === undefined) {
      return null;
    }

    addedSurvey = {
      id: surveyResponse.data[0].SurveyID,
      name: surveyResponse.data[0].Name,
      description: surveyResponse.data[0].Description,
      expirationDate: new Date(surveyResponse.data[0].ExpirationDate),
      ownerID: surveyResponse.data[0].OwnerID,
      chatKeyID: surveyResponse.data[0].ChatKeyID,
      options: [],
    }

    const surveyID = surveyResponse.data[0].SurveyID;

    // the option must be in a array with the following structure:
    // [{
    //   OptionID: number, (0, 1, 2, 3, ...)
    //   OptionName: string,
    //   SurveyID: number
    // }]

    const surveyOptions = surveyToAdd.options.map((option, index) => {
      return {
        OptionID: index,
        OptionName: option.name,
        SurveyID: surveyID
      }
    });

    // fetch the supabase database
    const optionsResponse = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .insert(surveyOptions);

    if (optionsResponse.data === null || optionsResponse.error !== null || optionsResponse.data.length === 0) {
      return null;
    }

    addedSurvey.options = optionsResponse.data.map((option) => {
      return {
        id: option.OptionID,
        name: option.OptionName,
      };
    });

    return addedSurvey;
  }


  /**
  * This function is used to add a new vote for a survey option to the database.
  * @param voteToAdd the vote object to add to the database
  * @returns {Promise<ISurveyVote>} the vote object containing all information (with the added voteID)
  */
  public addNewVote = async (voteToAdd: ISurveyVote): Promise<ISurveyVote | null> => {
    let addedVote: ISurveyVote | null = null;

    // check if survey is still open
    let isExpired = await this.isSurveyExpired(voteToAdd.surveyID);

    if (isExpired === true || isExpired === null) {
      return null;
    }

    // check if the survey and the option exist
    const optionResponse = await DatabaseModel.CLIENT
      .from('SurveyOption')
      .select()
      .match({ SurveyID: voteToAdd.surveyID, OptionID: voteToAdd.optionID });

    if (optionResponse.data === null || optionResponse.error !== null || optionResponse.data.length === 0) {
      return null;
    }

    // fetch the supabase database
    const voteResponse = await DatabaseModel.CLIENT
      .from('SurveyVote')
      .insert([
        {
          UserID: voteToAdd.userID,
          SurveyID: voteToAdd.surveyID,
          OptionID: voteToAdd.optionID,
        },
      ])

    if (voteResponse.data === null || voteResponse.error !== null || voteResponse.data.length === 0) {
      return null;
    }

    addedVote = {
      userID: voteResponse.data[0].UserID,
      surveyID: voteResponse.data[0].SurveyID,
      optionID: voteResponse.data[0].OptionID,
    }

    return addedVote;
  }

  /**
  * This function is used to check if a survey is expired or not.
  * @param surveyID the surveyID of the survey to check if it is expired
  * @returns {boolean} true if the survey is expired, false if not
  */
  public isSurveyExpired = async (surveyID: number): Promise<boolean | null> => {
    // fetch the supabase database
    const surveyResponse = await DatabaseModel.CLIENT
      .from('Survey')
      .select()
      .match({ SurveyID: surveyID });

    if (surveyResponse.data === null || surveyResponse.error !== null || surveyResponse.data.length === 0) {
      return null;
    }

    return new Date(surveyResponse.data[0].ExpirationDate) < new Date();
  }

  /**
   * This function is used to check if a survey is in a room or not.
   * @param {number} surveyID the surveyID of the survey to check
   * @param {number} chatKeyID the chatKeyID of the room to check
   * @returns {boolean} true if the survey is in the room or not
   */
  public isSurveyInRoom = async (surveyID: number, chatKeyID: number): Promise<boolean> => {
    // fetch the supabase database
    const surveyResponse = await DatabaseModel.CLIENT
      .from('Survey')
      .select()
      .match({ SurveyID: surveyID, ChatKeyID: chatKeyID });

    if (surveyResponse.data === null || surveyResponse.error !== null || surveyResponse.data.length === 0) {
      return false;
    }
    return true;
  }

  //#endregion
}