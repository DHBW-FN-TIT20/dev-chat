import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IChatMessage, ISurvey, ISurveyState, ISurveyVote, IUser } from '../../public/interfaces';
import { ExampleCommand } from '../../console_commands/example';
import { Command } from '../../console_commands/baseclass';
import splitString from '../../shared/splitstring';
import { SurveyCommand } from '../../console_commands/survey';
import { VoteCommand } from '../../console_commands/vote';
import { ShowCommand } from '../../console_commands/show';

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
      new SurveyCommand,
      new VoteCommand,
      new ShowCommand
    ];
  }


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
  private async executeCommand(userInput: string, currentUser: IUser, currentChatKeyID: number): Promise<boolean> {

    // split the user input into the command and the arguments
    let callString: string = splitString(userInput)[0].slice(1);
    let callArguments: string[] = splitString(userInput).slice(1);

    console.log("SupabaseConnection.executeCommand()", callString, callArguments);
    

    for (let i = 0; i < this.commands.length; i++) {
      let command = this.commands[i];
      console.log(command.callString, callString);
      
      if (command.callString == callString) {
        console.log("command found");
        

        // a command was found -> execute it
        const answerLines: string[] = await command.execute(callArguments, currentUser, currentChatKeyID);

        // check if the command was executed successfully (If this is not the case, command.execute returns an empty array.)
        if (answerLines.length === 0 || answerLines === undefined) {
          // no answer -> command was not executed successfully
          this.addChatMessage(command.helpText, currentChatKeyID, undefined, 1 );
          return false;
        } else {

          console.log(answerLines);

          // create a message for each line of the answer
          for (let i = 0; i < answerLines.length; i++) {
            await this.addChatMessage(answerLines[i], currentChatKeyID, undefined, 1 );
          }

          console.log("Command executed successfully.");

          return true; // answer -> command was executed successfully
        }
      }
    };

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
  public isUserValid = async (user: { id?: number, name?: string, password: string }): Promise<boolean> => {
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
   * This method returns all user informations for the given username
   * @param username the username of the user
   * @returns {Promise<IUser>} the user object containing all information
   */
  public getIUserByUsername = async (username: string): Promise<IUser> => {
    const { data, error } = await SupabaseConnection.CLIENT
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
   * @param userID the userID of the user
   * @returns {Promise<IUser>} the user object containing all information
   */
   public getIUserByUserID = async (userID: number): Promise<IUser> => {
    const { data, error } = await SupabaseConnection.CLIENT
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

  public getCurrentSurveyState = async (surveyID: number): Promise<ISurveyState | null> => {
    let survey: ISurveyState;

    let surveyResponse = await SupabaseConnection.CLIENT
      .from('Survey')
      .select()
      .match({ SurveyID: surveyID });

    if (surveyResponse.data === null || surveyResponse.error !== null || surveyResponse.data.length === 0) {
      return null;
    }

    let optionResponse = await SupabaseConnection.CLIENT
      .from('SurveyOption')
      .select()
      .match({ SurveyID: surveyID });

    if (optionResponse.data === null || optionResponse.error !== null) {
      return null;
    }

    let voteResponse = await SupabaseConnection.CLIENT
      .from('SurveyVote')
      .select()
      .match({ SurveyID: surveyID });

    if (voteResponse.data === null || voteResponse.error !== null) {
      return null;
    }
    
    // console.log(surveyResponse, optionResponse, voteResponse);
    
    // assemble the survey object
    survey = {
      id: surveyResponse.data[0].SurveyID,
      name: surveyResponse.data[0].Name,
      description: surveyResponse.data[0].Description,
      expirationDate: surveyResponse.data[0].ExpirationDate,
      ownerID: surveyResponse.data[0].OwnerID,
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

  public addNewSurvey = async (surveyToAdd: ISurvey): Promise<ISurvey | null> => {
    let addedSurvey: ISurvey | null = null;

    // fetch the supabase database
    const surveyResponse = await SupabaseConnection.CLIENT
      .from('Survey')
      .insert([
        {
          Name: surveyToAdd.name,
          Description: surveyToAdd.description,
          ExpirationDate: surveyToAdd.expirationDate,
          OwnerID: surveyToAdd.ownerID,
        },
    ])

    if (surveyResponse.data === null || surveyResponse.error !== null || surveyResponse.data.length === 0 || surveyResponse.data[0].SurveyID === null || surveyResponse.data[0].SurveyID === undefined) {
      return null;
    }

    addedSurvey = {
      id: surveyResponse.data[0].SurveyID,
      name: surveyResponse.data[0].Name,
      description: surveyResponse.data[0].Description,
      expirationDate: surveyResponse.data[0].ExpirationDate,
      ownerID: surveyResponse.data[0].OwnerID,
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
    const optionsResponse = await SupabaseConnection.CLIENT
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


  public addNewVote = async (voteToAdd: ISurveyVote): Promise<ISurveyVote | null> => {
    let addedVote: ISurveyVote | null = null;

    // check if the survey and the option exist
    const optionResponse = await SupabaseConnection.CLIENT
      .from('SurveyOption')
      .select()
      .match({ SurveyID: voteToAdd.surveyID, OptionID: voteToAdd.optionID });

    if (optionResponse.data === null || optionResponse.error !== null || optionResponse.data.length === 0) {
      return null;
    }

    // fetch the supabase database
    const voteResponse = await SupabaseConnection.CLIENT
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
    } else if (userId === undefined) {
      return false;
    }
    
    const { data, error } = await SupabaseConnection.CLIENT
    .from('ChatMessage')
    .insert([
      { ChatKeyID: chatKeyId, UserID: userId, TargetUserID: '0', Message: message },
    ])

    if(message[0] === "/") {
      console.log("Command detected");
      await this.executeCommand(message, await this.getIUserByUserID(userId), chatKeyId);
    }

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
  public addChatKey = async (chatKey: string): Promise<boolean> => {

    let chatKeyExists = await this.chatKeyAlreadyExists(chatKey)

    if (chatKeyExists) {
      return false;
    }

    var expirationDate = new Date();
    // currentDate + 1 Day = ExpirationDate
    expirationDate.setDate(expirationDate.getDate() + 1);
    console.log("Chat Key expires: " + expirationDate);

    const { data, error } = await SupabaseConnection.CLIENT
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

  //#region User Token Methods

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
    if (this.isTokenValid(token) && await this.userAlreadyExists(this.getUsernameFromToken(token))) {
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
    if (await this.isUserValid({ name: username, password: password })) {
      let user = await this.getIUserByUsername(username);
      if (user !== {}) {
        console.log(user)
        let token = jwt.sign({
          username: username,
          isAdmin: (user.accessLevel === 1)
        }, SupabaseConnection.KEY, { expiresIn: '1 day' });
        return token;
      }
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

  /**
   * This method changes the password from the current user
   * @param {string} token Token to extract username from
   * @param {string} oldPassword contains the old User Password
   * @param {string} newPassword contains the new User Password
   * @returns {Promise<boolean>} if password was changed -> return true
   */
     public changeUserPassword = async (token: string, oldPassword: string, newPassword: string): Promise<boolean> => {
      let userName: string = "" 
      let currentUser: IUser

      if(await this.isUserTokenValid(token)) {
          userName = this.getUsernameFromToken(token);
          if(userName !== null && userName !== "") {
            currentUser = await this.getIUserByUsername(userName);        
            if(currentUser !== null && this.isPasswordValid(newPassword) && currentUser.hashedPassword !== undefined && await this.checkPassword(oldPassword, currentUser.hashedPassword)) {
              //first hash then Save
              let hashedPassword = await this.hashPassword(newPassword);

              const { data, error } = await SupabaseConnection.CLIENT
              .from('User')
              .update({ Password: hashedPassword})
              .eq('UserID', currentUser.id);
              return true;            
            }
          }
      }
      return false;
    }
  //#endregion
}