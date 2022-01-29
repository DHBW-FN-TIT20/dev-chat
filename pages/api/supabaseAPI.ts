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
   * API function to remove a user from the database 
   * @param {string} username the username of the user to remove
   * @param {string} hashedPassword to remove
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the user was removed
   */
   public removeUser = async (username: string, hashedPassword: string): Promise<boolean> => {

    // check if the user and the password are correct
    const isValid = await this.isUserValid({name: username, password: hashedPassword});

    if (!isValid) {
      // user and password are not correct -> return false
      return false;
    }

    // fetch the supabase database
    const { data, error } = await SupabaseConnection.CLIENT
      .from('User')
      .delete()
      .match({ Username: username, Password: hashedPassword });

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




