import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IChatMessage } from '../../public/interfaces';

/**
 * This is the connection to the supabase database.
 * All the api routes should lead to this class.
 * The methods of the class are used to get/post data from/to the database.
 */
export class SupabaseConnection {
  private static CLIENT: SupabaseClient;
  constructor() {
    // supabaseUrl and supabaseKey should be replaced by the environment variables
    // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''; 
    const supabaseUrl = "https://yffikhrkategkabkunhj.supabase.co"
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDUzODUzMywiZXhwIjoxOTU2MTE0NTMzfQ.t0QAIVdegnHXUXQb9XGy2vMItq2KvgcTI6Lk1t-rV5Q"
    SupabaseConnection.CLIENT = createClient(supabaseUrl, supabaseKey);
  }  
  
  /** 
   * API function to check if the username/userID and the password are correct 
   * @param {string} username the username to check
   * @param {number} userID the userID to check
   * @param {string} password the password to check
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username and password are correct
   */
  public isUserValid = async (user: {id?: number, name?: string, password: string}): Promise<boolean> => {
    let supabaseData: any;
    let supabaseError: any;

    if (user.id !== undefined) {
      // check if user is valid with the userID

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('UserID', user.id)
        .eq('Password', user.password);
      
      supabaseData = data;
      supabaseError = error;

    } else if (user.name !== undefined) {
      // check if user is valid with the username

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('Username', user.name)
        .eq('Password', user.password);

      supabaseData = data;
      supabaseError = error;

    } else {
      return false;
    }

    // check if data was received
    if (supabaseData === null || supabaseError !== null || supabaseData.length === 0) {

      // no users found -> user does not exist or password is wrong -> return false
      return false;
    } else {
      // user exists -> return true
      return true;
    }
  };

  /**
   * This helper function is used to get the userID of a user by username
   * @param username the username of the user
   * @returns the userID of the user
   */
  public getUserIDByUsername = async (username: string): Promise<number> => {
    // fetch the supabase database
    const { data, error } = await SupabaseConnection.CLIENT
      .from('User')
      .delete()
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
   * API function to remove a user from the database 
   * @param {number} currentUserId the id of the user who is logged in
   * @param {string} currentUserPassword the hashed password of the user who is logged in
   * @param {string} usernameToDelete the username of the user to be removed
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the user was removed
   */
  public removeUser = async (currentUserId: number, currentUserPassword: string, usernameToDelete: string): Promise<boolean> => {
  
    // check if the user and the password are correct
    const isValid = await this.isUserValid({id: currentUserId, password: currentUserPassword});

    if (!isValid) {
      // user and password are not correct -> return false
      return false;
    }

    // check if user is allowed to remove the user
    let isAllowed = (currentUserId === 1 || currentUserId === 2);

    if (!isAllowed) {
      // user is not a super user so it needs to be checkt if the user wants to remove himself
      let userID = await this.getUserIDByUsername(usernameToDelete);
      if (userID === currentUserId) {
        isAllowed = true;
      }
    }

    if (!isAllowed) {
      // user is not allowed to remove the user -> return false
      return false;
    }

    // fetch the supabase database
    const { data, error } = await SupabaseConnection.CLIENT
      .from('User')
      .delete()
      .match({ Username: usernameToDelete });

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // user was not removed -> return false
      return false;
    } else {
      // user was removed -> return true
      return true;
    }


  };

  /** 
 * API function to add a Chat Message to the database 
 * @param {string} message the message of the user
 * @param {string} userId the Id of the User
 * @param {string} chatKeyId the Id of the Chatroom
 * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the message was added
 */
  public addChatMessage = async (message: string, userId: string, chatKeyId: string): Promise<boolean> => {
    const { data, error } = await SupabaseConnenction.CLIENT
      .from('ChatMessage')
      .insert([
        {ChatKeyID: chatKeyId, UserID: userId, TargetUserID: '0', Message: message},
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

  /** 
   * API function to get all chat messages from the database 
   * @param {number} targetID the id of the user who is logged in
   * @param {string} targetPassword the password of the user who is logged in
   * @param {string} chatKey the chat key of the chat that is currently open
   * @returns {Promise<IChatKeyMessage[]>}
   */
  public getChatMessages = async (targetID: number, targetPassword: string, chatKey: string, lastMessageID: number): Promise<IChatMessage[]> => {
    
    let chatMessages: IChatMessage[] = [];

    // check if user is valid
    let userIsValid: boolean = await this.isUserValid({id: targetID, password: targetPassword});

    if (!userIsValid) {
      return chatMessages;
    }

    // get id of chatkey
    let chatKeyID = await this.getChatKeyID(chatKey);

    if (chatKeyID === null || chatKeyID === undefined) {
      return chatMessages;
    }

    let filterString = "TargetUserID.eq." + String(targetID) + ",TargetUserID.eq.0";

    
    const { data, error } = await SupabaseConnection.CLIENT
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

  private getChatKeyID = async (chatKey: string): Promise<number> => {

    // fetch the data from the supabase database
    const { data, error } = await SupabaseConnection.CLIENT
      .from('ChatKey')
      .select()
      .eq('ChatKey', chatKey);

    if (data === null || error !== null || data.length === 0) {
      return NaN;
    }
    return data[0].ChatKeyID;
  };

}