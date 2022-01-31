import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IChatMessage } from '../../public/interfaces';
import * as bcrypt from 'bcrypt'

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
  
  /** 
   * API function to check if the username and the password are correct 
   * @param {string} username the username to check
   * @param {string} password the password to check
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username and password are correct
   */
  public isUserValid = async (username: string, password: string): Promise<boolean> => {

    // fetch the data from the supabase database
    const { data, error } = await SupabaseConnenction.CLIENT
      .from('User')
      .select()
      .eq('Username', username);

    // check if data was received
    if (data === null || error !== null || data.length === 0) {

      // no users found -> user does not exist or password is wrong -> return false
      return false;
    } else {
      // user exists
      return this.checkPassword(password, data[0].Password);
    }
  };

   /** 
   * API function to check if the username and the password are correct 
   * @param {string} username the username to check
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username already exists
   */
  public userAlreadyExists = async (username: string): Promise<boolean> => {

    // fetch the data from the supabase database
    const { data, error } = await SupabaseConnenction.CLIENT
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
   * API function to remove a user from the database 
   * @param {string} username the username of the user to remove
   * @param {string} hashedPassword the hashed password of the user to remove
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the user was removed
   */
   public removeUser = async (username: string, password: string): Promise<boolean> => {

    // check if the user and the password are correct
    const isValid = await this.isUserValid(username, password);

    if (!isValid) {
      // user and password are not correct -> return false
      return false;
    }

    // fetch the supabase database
    const { data, error } = await SupabaseConnenction.CLIENT
      .from('User')
      .delete()
      .match({ Username: username });

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
   * API function to insert the username and the password 
   * @param {string} username the username to insert
   * @param {string} password the password to check
   * @param {number} [accessLevel=0] User AccessLevel.
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the user was created
   */
     public registerUser = async (username: string, password: string, accessLevel: number = 0): Promise<boolean> => {  
      let userAlreadyExists = await this.userAlreadyExists(username)        

      if(userAlreadyExists) {
        return false;
      }

      let hashedPassword = await this.hashPassword(password);

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnenction.CLIENT
        .from('User')
        .insert([
          {"Username": username, "Password": hashedPassword, "AccessLevel": accessLevel}
        ]);
  
      // check if data was received
      if (data === null || error !== null || data.length === 0) {
        // user was not created -> return false
        return false;
      } else {
        // user was created -> return true
        return true;
      }
      
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




