import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IChatMessage } from '../../public/interfaces';
import { ExampleCommand } from '../../console_commands/example';
import { Command } from '../../console_commands/baseclass';

/**
 * This is the connection to the supabase database.
 * All the api routes should lead to this class.
 * The methods of the class are used to get/post data from/to the database.
 */
export class SupabaseConnection {
  private static CLIENT: SupabaseClient;
  private static KEY: string;
  private commands: Command[] = [];

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || ''; 
    SupabaseConnection.CLIENT = createClient(supabaseUrl, supabaseKey);
    SupabaseConnection.KEY = "Krasser Schlüssel";
    this.commands = [
      // add all command classes here
      new ExampleCommand,
    ];
  }  


  /**
   * This function is used to check a new message for commands. 
   * After the command is found, the command is executed.
   * The Command.execute() method is called and it returns the answer of the command as an array of strings.
   * Each string represents one line of the answer and is sent as a message to the user.
   * @param {string} callString This string should be the first word of the message. It is the trigger for the command.
   * @param {string[]} callArguments This array of strings are the argments of the command.
   * @returns {Promise<boolean>} Returns true if a command was executed successfully. Returns false if no command was executed or if the command failed to execute.
   */
  private async executeCommand(callString: string, callArguments:string[]): Promise<boolean> {
    this.commands.forEach(async command => {
      if (command.callString == callString) {

        // a command was found -> execute it
        const answerLines: string[] = await command.execute(callArguments);

        // check if the command was executed successfully (If this is not the case, command.execute returns an empty array.)
        if (answerLines.length === 0 || answerLines === undefined) {

          // no answer -> command was not executed successfully
          return false;
        } else {

          // create a message for each line of the answer
          answerLines.forEach(line => {
            // this.newMessage(line, target: current user, ...); NOTE: need to be implemented!!
          });

          return true; // answer -> command was executed successfully
        }
      }
    });

    return false; // command was not found
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
        .eq('UserID', user.id);
      
      supabaseData = data;
      supabaseError = error;

    } else if (user.name !== undefined) {
      // check if user is valid with the username

      // fetch the data from the supabase database
      const { data, error } = await SupabaseConnection.CLIENT
        .from('User')
        .select()
        .eq('Username', user.name);

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
      // user exists
      return this.checkPassword(user.password, supabaseData[0].Password);
    }
  };

   /** 
   * API function to check if the username and the password are correct 
   * @param {string} username the username to check
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the username already exists
   */
  public userAlreadyExists = async (username: string): Promise<boolean> => {

    // fetch the data from the supabase database
    const { data, error } = await SupabaseConnection.CLIENT
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
   * API function to check if the input ChatKey exists
   * @param {string} chatKey the chatKey to check
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatkey exists
   */
      public doesChatKeyExists = async (chatKey: string): Promise<boolean> => {

        // fetch the data from the supabase database
        const { data, error } = await SupabaseConnection.CLIENT
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
      
  /**
   * This helper function is used to get the userID of a user by username
   * @param {string} username the username of the user
   * @returns {Promise<number>} the userID of the user
   */
  public getUserIDByUsername = async (username: string): Promise<number> => {
    // fetch the supabase database
    const { data, error } = await SupabaseConnection.CLIENT
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
   * API function to add a Chat Message to the database 
   * @param {string} message the message of the user
   * @param {number} chatKeyId the chatKeyId of the Chatroom
   * @param {string} userToken the token from the logged in user
   * @param {number} userId the Id of the User
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the message was added
   */
  public addChatMessage = async (message: string, chatKeyId: number, userToken?: string, userId?: number): Promise<boolean> => {
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
    }
    const { data, error } = await SupabaseConnection.CLIENT
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
   * API function to add a Chat Key to the database 
   * @param {string} chatKey the Id of the new Chatroom
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the chatKey was added
   */
   public addChatKey= async (chatKey: string): Promise<boolean> => {
   
    let chatKeyExists = await this.chatKeyAlreadyExists(chatKey)        

    if(chatKeyExists) {
      return false;
    }

    var expirationDate = new Date();
    // currentDate + 1 Day = ExpirationDate
    expirationDate.setDate(expirationDate.getDate() + 1); 
    console.log("Chat Key expires: " + expirationDate);
    
    const { data, error } = await SupabaseConnection.CLIENT
      .from('ChatKey')
      .insert([
        {ChatKey: chatKey, ExpirationDate: expirationDate},
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
    const { data, error } = await SupabaseConnection.CLIENT
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
    let chatKeyID = await this.getChatKeyID(chatKey);

    if (chatKeyID === null || chatKeyID === undefined) {
      return chatMessages;
    }

    let targetID = await this.getUserIDFromToken(token);

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
   * API funciton to get the id of a threeword chatKey
   * @param {string} chatKey the threeword
   * @returns {Promise<number>} id of threeword
   */
  public getChatKeyID = async (chatKey: string): Promise<number> => {

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

  //# SECTION USER TOKEN

  /**
   * This mehtod checks a username for requirements
   * @param {string} username username to check
   * @returns {boolean} true if the username meets the requirements, false if not
   */
  public isUsernameValid = (username: string): boolean => {
    //TODO: Lukas implement task 50
    return true;
  }

  /**
   * This method checks a password for requirements
   * @param {string} password password to check
   * @returns {boolean} true if the password meets the requirements, false if not
   */
  public isPasswordValid = (password: string): boolean => {
    // TODO: Lukas implement task 50
    return true;
  }

  /**
   * This method validates a given token with the current key.
   * @param {string} token Token to validate
   * @returns {boolean} True if the token is valid, false if not
   */
  public isTokenValid = (token: string): boolean => {
    try {
      jwt.verify(token, SupabaseConnection.KEY);
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
    if (this.isTokenValid(token)) {
      if (await this.userAlreadyExists(this.getUsernameFromToken(token))) {
        console.log("user exists")
        return true;
      }
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
   * This method returns the userID of the user extracted from the token
   * @param {string} token Token to extract userID from
   * @returns {Promise<number>} UserID if token contains username, NaN if not
   */
  public getUserIDFromToken = async (token: string): Promise<number> => {
    let username = this.getUsernameFromToken(token);
    return await this.getUserIDByUsername(username);
  }

  /**
   * This method logs in a user if the given credentials are valid.
   * @param {string} username Username to log in
   * @param {string} password Password for the given username
   * @returns {Promise<string>} Signed token with username if login was successfull, empty string if not
   */
  public loginUser = async (username: string, password: string): Promise<string> => {
    if (await this.isUserValid({name: username, password: password})) {
      let token = jwt.sign({
        username: username,
      }, SupabaseConnection.KEY, {expiresIn: '1 day'});
      return token;
    }
    return "";
  }

  /**
   * API function to register a user
   * @param {string} user username to register
   * @param {string} password password for the user
   * @param {number} accessLevel access level for the user
   * @returns {Promise<boolean>} true if registration was successfull, false if not
   */
   public registerUser = async (username: string, password: string, accessLevel: number = 0): Promise<boolean> => {

    let userExists = await this.userAlreadyExists(username);

    if (!this.isUsernameValid(username) || !this.isPasswordValid(password) || userExists) {
      return false;
    }

    let hashedPassword = await this.hashPassword(password);

    const { data, error } = await SupabaseConnection.CLIENT
      .from('User')
      .insert([
        { Username: username, Password: hashedPassword, "AccessLevel": accessLevel },
      ]);

    if (data === null || error !== null || data.length === 0) {
      return false;
    }
    return true;
  }

  /**
   * This method removes a target user from the database
   * @param {string} userToken user token to verificate delete process
   * @param {string} usernameToDelete username of user to delete
   * @returns {Promise<boolean>} true if user was deleted, false if not
   */
  public deleteUser = async (userToken: string, usernameToDelete: string): Promise<boolean> => {
    // check if the user and the password are correct
    const isValid = await this.isUserTokenValid(userToken);

    if (!isValid) {
      // user and password are not correct -> return false
      return false;
    }

    const currentUserId = await this.getUserIDFromToken(userToken);
    const targetUserId = await this.getUserIDByUsername(usernameToDelete);

    // check if user is allowed to remove the user (either admin user or target is the user himself)
    let isAllowed = (currentUserId === 1 || currentUserId === 2 || currentUserId === targetUserId);

    if (!isAllowed) {
      // user is not allowed to remove the user -> return false
      return false;
    }

    // fetch the supabase database
    const { data, error } = await SupabaseConnection.CLIENT
      .from('User')
      .delete()
      .match({ UserID: targetUserId });

    // check if data was received
    if (data === null || error !== null || data.length === 0) {
      // user was not removed -> return false
      return false;
    } else {
      // user was removed -> return true
      return true;
    }
  }

  //# SECTION USER TOKEN END
}