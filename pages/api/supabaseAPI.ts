import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IChatMessage, ISurvey } from '../../public/interfaces';
import * as bcrypt from 'bcrypt'
import { SurveyCommand } from '../../console_commands/survey';
import { Command } from '../../console_commands/baseclass';

/**
 * This is the connection to the supabase database.
 * All the api routes should lead to this class.
 * The methods of the class are used to get/post data from/to the database.
 */
export class SupabaseConnection {
  private static CLIENT: SupabaseClient;
  private commands: Command[] = [];

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || ''; 
    SupabaseConnection.CLIENT = createClient(supabaseUrl, supabaseKey);
    this.commands = [
      // add all command classes here
      new SurveyCommand,
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
        const answerLines: string[] = await command.execute(callArguments, {id: 17, name: "johannes"}, 4);

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
    const { data, error } = await SupabaseConnection.CLIENT
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
   * API function to add a Chat Message to the database 
   * @param {string} message the message of the user
   * @param {string} userId the Id of the User
   * @param {string} chatKeyId the Id of the Chatroom
   * @returns {Promise<boolean>} a promise that resolves to an boolean that indicates if the message was added
   */
  public addChatMessage = async (message: string, userId: string, chatKeyId: string): Promise<boolean> => {
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


  public addNewSurvey = async (survesToAdd: ISurvey): Promise<ISurvey | null> => {
    // NOTE: not implemented yet

    // fetch the data from the supabase database
    return null;
  }
}