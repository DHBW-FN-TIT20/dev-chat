import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IChatMessage } from '../../public/interfaces';

/**
 * This is the connection to the supabase database.
 * All the api routes should lead to this class.
 * The methods of the class are used to get/post data from/to the database.
 */
export class SupabaseConnenction {
  private static CLIENT: SupabaseClient;
  constructor() {
    // supabaseUrl and supabaseKey should be replaced by the environment variables
    // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''; 
    const supabaseUrl = "https://yffikhrkategkabkunhj.supabase.co"
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDUzODUzMywiZXhwIjoxOTU2MTE0NTMzfQ.t0QAIVdegnHXUXQb9XGy2vMItq2KvgcTI6Lk1t-rV5Q"
    SupabaseConnenction.CLIENT = createClient(supabaseUrl, supabaseKey);
  }  
  
  /** 
   * API function to check if the username and the password are correct 
   * @param {string} username the username to check
   * @param {string} password the password to check
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username and password are correct
   */
  public isUserValid = async (username: string, hashedPassword: string): Promise<boolean> => {

    // fetch the data from the supabase database
    const { data, error } = await SupabaseConnenction.CLIENT
      .from('User')
      .select()
      .eq('Username', username)
      .eq('Password', hashedPassword);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // no users found -> user does not exist or password is wrong -> return false
      return false;
    } else {
      // user exists -> return true
      return true;
    }
  };


  /** 
   * API function to remove a user from the database 
   * @param {number} currentUserId the id of the user who is logged in
   * @param {string} currentUserPassword the hashed password of the user who is logged in
   * @param {string} usernameToDelete the username of the user to be removed
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the user was removed
   */
   public removeUser = async (currentUserId: number, currentUserPassword: string, usernameToDelete: string): Promise<boolean> => {

    // // check if the user and the password are correct
    // const isValid = await this.isUserValid(username, hashedPassword);

    // if (!isValid) {
    //   // user and password are not correct -> return false
    //   return false;
    // }

    // // fetch the supabase database
    // const { data, error } = await SupabaseConnenction.CLIENT
    //   .from('User')
    //   .delete()
    //   .match({ Username: username, Password: hashedPassword });

    // // check if data was received
    // if (data === null || error !== null || data.length === 0) {

    //   // user was not removed -> return false
    //   return false;
    // } else {
    //   // user was removed -> return true
    //   return true;
    // }
    return false;
  };


  /** 
   * API function to remove a user from the database 
   * @param {string} username the username of the user to remove
   * @param {string} hashedPassword the hashed password of the user to remove
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the user was removed
   */
  public getChatMessages = async (threeword: string): Promise<IChatMessage[]> => {
    
    return [];
  };

} 




