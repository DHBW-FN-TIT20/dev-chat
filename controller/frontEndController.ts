//#region Imports

import jwt from 'jsonwebtoken'
import { setCookies, getCookies, getCookie, removeCookies, checkCookies } from 'cookies-next';
import { IBugTicket, IChatKey, IChatMessage, ISurvey, IUser } from '../public/interfaces';
import chat from '../pages/chat';
import { DatabaseModel } from '../pages/api/databaseModel';

//#endregion

/**
 * This is the controller of the DEV-CHAT-APP.
 */
export class FrontEndController {
  //#region Private Variables

  private data: any;
  public chatMessages: IChatMessage[] = [];
  private chatMessageInterval: any;
  private chatKeyCookieName: string = "DevChat.ChatKey";

  //#endregion

  //#region Constructor

  constructor() {
    console.log("DevChatController.constructor()");
    this.data = {
      message: 'Hello, this is the controller of the DEV-CHAT-APP.'
    };
  }

  //#endregion

  //#region Chat Methods

  /**
   * This is a function that adds a message to the database
   * @param {string} message the message of the user to added
   * @param {string} userToken the user token of the user who sends the message (logged in)
   * @param {string} chatKey the chat key of the chatroom
   * @returns {Promise<boolean>} true if the message was send, false if not
  **/
  public addChatMessage = async (message: string, userToken: string, chatKey: string): Promise<boolean> => {
    let response = await fetch('./api/messages/save_chat_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        userToken: userToken,
        chatKey: chatKey
      })
    });
    let data = await response.json();
    console.log("addChatMessage(" + message + "): " + data.wasSuccessfull);
    return data.wasSuccessfull;
  }

  /**
   * This function is used to get the chat messages from the database.
   * @param {string} token userToken from logged in user
   * @param {string} chatKey the three-word of the chat
   * @param {number} lastMessageID the id of the last message that was received
   * @returns {Promise<IChatMessage[]>} Fetched messages from database
   */
  public fetchChatMessages = async (token: string, chatKey: string, lastMessageID: number = 0): Promise<IChatMessage[]> => {
    console.log("DevChatController.fetchChatMessages()");
    let chatMessages: IChatMessage[] = [];

    let response = await fetch('./api/messages/get_chat_messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: token,
        chatKey: chatKey,
        lastMessageID: lastMessageID
      })
    });
    let data = await response.json();

    chatMessages = data.chatMessages;

    return chatMessages;
  }

  /**
   * This method updates the data of the chat.
   * @returns {Promise<IChatMessage[]>} The updated chat messages.
   */
  public async updateChatMessages(): Promise<IChatMessage[]> {
    console.log("DevChatController.updateChatMessages()");
    
    // get the highest id of the chat messages to only get the new messages
    let lastMessageId: number = 0;
    if (this.chatMessages.length > 0) {
      lastMessageId = Math.max.apply(Math, this.chatMessages.map(function(message) { return message.id; }) || [0]);
    }
    
    let userToken = this.getUserToken();

    // get the new messages
    let newMessages: IChatMessage[] = await this.fetchChatMessages(userToken , this.getChatKeyFromCookie(), lastMessageId);

    // console.log("newMessages: ");
    // console.table(newMessages);

    // add the new messages to the chat messages
    this.chatMessages = this.chatMessages.concat(newMessages);

    return this.chatMessages;
  }

  /**
   * This method sends a join message to the database
   */
  public async joinRoomMessage() {
    let userToken = this.getUserToken();
    let chatKey = this.getChatKeyFromCookie();
    let response = await fetch('./api/messages/join_leave_room_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        chatKey: chatKey,
        joinOrLeave: "join"
      })
    });
    let data = await response.json();
    console.log("joinRoomMessage(): " + data.messageAddedSuccessfully);
  }

  /**
   * This method sends a leave message to the database
   */
  public async leaveRoomMessage() {
    let userToken = this.getUserToken();
    let chatKey = this.getChatKeyFromCookie();
    let response = await fetch('./api/messages/join_leave_room_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        chatKey: chatKey,
        joinOrLeave: "leave"
      })
    });
    let data = await response.json();
    console.log("leaveRoomMessage(): " + data.messageAddedSuccessfully);
  }

  /**
   * Function to start fetching messages from the Database
   */
  public async startMessageFetch() {
    while (true) {
      console.log("Start updateChatMessage in while loop.")
      await this.updateChatMessages();
    }
  }

  /**
   * This method is used to process a new message which is entered in the Chat.
   * @param {string} message The input string of the user which should be processed.
   */
  public async enteredNewMessage(message: string) {
    console.log("DevChatController.enteredNewMessage()");
    console.log("in Controller: " + message);
    this.addChatMessage(message, this.getUserToken(), this.getChatKeyFromCookie());
  }

  //#endregion

  //#region Chat Key Methods

  /**
* This method checks the database for a ChatKey with the given ChatKeyName
* @param {string} ChatKey ChatKey to check
* @returns {Promise<boolean>} True if ChatKey exists, false if not
*/
  public doesChatKeyExists = async (chatKey: string): Promise<boolean> => {
    let response = await fetch('./api/chatkeys/does_chat_key_exists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatKey: chatKey,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This is a function that delete old chat keys from the database
   * @returns {Promise<boolean>} true if old chat keys were deleted
   **/
  public deleteOldChatKeys = async (): Promise<boolean> => {
    console.log("TEST VON PHILLIPP DELETE IM CONTROLLER")
    let response = await fetch('./api/chatkeys/delete_old_chat_keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * Function to create a ChatKey and add it to DB
   * @returns {Promise<boolean>} true if the chatkey was created, false if the chat Key was not created
  **/
  public async addChatKey(): Promise<boolean> {
    //Creates new chat Key and adds to DB
    //TODO set Coockie
    let response = await fetch('./api/chatkeys/add_chat_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    let data = await response.json();
    console.log("addChatKey(): " + data.wasSuccessfull);
    if (data.wasSuccessfull == true) {
      this.setChatKeyCookie(data.newChatKey);
    }
    return data.wasSuccessfull;
  }

  /**
   * Function to create a custom ChatKey and add it to DB
   * @returns {Promise<boolean>} true if the chatkey was created, false if the chat Key was not created
  **/
   public async addCustomChatKey(userToken: string, customChatKey: string): Promise<boolean> {
    //Creates new chat Key and adds to DB
    let response = await fetch('./api/chatkeys/add_custom_chat_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        customChatKey: customChatKey
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }
  
  //#endregion 

  //#region Cookie Methods

  /**
   * This method creates a cookie with the given chat key as value
   * @param {string} chatKey Value for cookie
   */
  public setChatKeyCookie(chatKey: string) {
    console.log("setChatKeyCookie(" + chatKey + ")")
    setCookies(this.chatKeyCookieName, chatKey);
  }

  /**
   * This method removes the chat key cookie if it exists
   */
  public clearChatKeyCookie() {
    removeCookies(this.chatKeyCookieName);
  }

  /**
   * This method returns the value of the chat key cookie
   * @returns {string} Chat key if exits, empty string if not
   */
  public getChatKeyFromCookie(): string {
    let chatKey = getCookie(this.chatKeyCookieName);
    if (typeof chatKey === 'string') {
      return chatKey;
    }
    return ""
  }

  //#endregion

  //#region Survey Methods

  /**
   * This function is used to change the expiration Date of a survey
   * @param userToken 
   * @param surveyIDToAlter 
   * @param expirationDate 
   * @returns 
   */
  public changeSurveyExpirationDate = async (userToken: string, surveyIDToAlter: number | undefined, expirationDate: Date | null): Promise<boolean> => {
    let response = await fetch('./api/surveys/changeExpiration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        surveyIDToAlter: surveyIDToAlter,
        expirationDate: expirationDate,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

     /**
      *  A function that is used to delete a certain survey
      * @param userToken - userToken of the current user
      * @param surveyIDToDelete  - ID of the survey that should be deleted
      * @returns 
      */
     public deleteSurvey = async (userToken: string, surveyIDToDelete: number | undefined): Promise<boolean> => {
      let response = await fetch('./api/surveys/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userToken: userToken,
          surveyIDToDelete: surveyIDToDelete,
        })
      });
      let data = await response.json();
      return data.wasSuccessfull;
    }

     /**
      * This function is used to get all Surveys
      * @returns Array of ISurveys
      */
     public getAllSurveys = async (): Promise<ISurvey[]> => {
      let allSurveys: ISurvey[] = [];
      let userToken = this.getUserToken();
      let response = await fetch('/api/surveys/getAllSurveys',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         userToken: userToken,
       })
     });
     let dataUser = await response.json();
     allSurveys = dataUser.allSurveys;
     return allSurveys;
     }

  //#endregion

  //#region ChatKey Methods


  /**
   * This function is used to change the expiration Date of a certain ChatKey
   * @param userToken current User
   * @param chatKeyToAlter 
   * @param expirationDate wanted date
   * @returns bool was sucessfull
   */
  public changeChatKeyExpirationDate = async (userToken: string, chatKeyToAlter: number | undefined, expirationDate: Date | null): Promise<boolean> => {
    let response = await fetch('./api/chatkeys/changeExpiration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        chatKeyToAlter: chatKeyToAlter,
        expirationDate: expirationDate,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This function deletes a certain chatKey
   * @param userToken current User
   * @param chatKeyToDelete 
   * @returns bool was successfull
   */
  public deleteChatKey = async (userToken: string, chatKeyToDelete: number | undefined): Promise<boolean> => {
    let response = await fetch('./api/chatkeys/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        chatKeyToDelete: chatKeyToDelete,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This functions is used to get all chatKeys 
   * @returns all IChatKeys in an array
   */
  public getAllChatKeys = async (): Promise<IChatKey[]> => {
    let allChatKeys: IChatKey[] = [];
    let userToken = this.getUserToken();
    let response = await fetch('/api/chatkeys/get_chat_keys',{
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       userToken: userToken,
     })
   });
   let dataUser = await response.json();
   allChatKeys = dataUser.allChatKeys;
   return allChatKeys;
   }

  //#endregion

  //#region Ticket Methods
  /**
   * This function is used to invert the status of a ticket. (ToDo->Done | Done->ToDo) It calls a API Route (changeSolvedState.ts)
   * @param currentToken 
   * @param ticketID 
   * @param currentState 
   * @returns 
   */
  public changeSolvedState = async (currentToken: string, ticketID: number | undefined, currentState: boolean | undefined): Promise<boolean> => {
    let response = await fetch('./api/tickets/changeSolvedState', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentToken: currentToken,
        ticketID: ticketID,
        currentState: currentState,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This function is used to get all Tickets
   * @returns all IBugTickets in an array
   */
  public getAllTickets = async (): Promise<IBugTicket[]> => {
    let allTickets: IBugTicket[] = [];
    let userToken = this.getUserToken();
    let response = await fetch('/api/tickets/getAllTickets',{
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       userToken: userToken,
     })
   });
   let dataUser = await response.json();
   allTickets = dataUser.allTickets;
   return allTickets;
   }
  //#endregion

  //#region User Methods

  /**
   * This method is used to get a username from a userID
   * @param userID 
   * @returns 
   */
  public getUserFromID = async (userID: number | undefined): Promise<string> => {
    let username: string;
    let response = await fetch('./api/users/getUserFromID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID : userID,
      })
    });
    let data = await response.json();
    username = data.wantedUser;
    console.log(username);
    return username;
  }

    /**
     * This Method is used to get an Array of all Users
     * @returns array of all IUsers
     */
    public getAllUsers = async (): Promise<IUser[]> => {
      let allUsers: IUser[] = [];
      let userToken = this.getUserToken();
      let response = await fetch('/api/users/getAllUsers',{
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         userToken: userToken,
       })
     });
     let dataUser = await response.json();
     allUsers = dataUser.allUsers;
     return allUsers;
     }
   

    /**
    * This method is used to promote a certain user
    */
     public promoteUser = async (userToken: string, usernameToPromote: string | undefined): Promise<boolean> => {
       let response = await fetch('./api/users/promote', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           userToken: userToken,
           usernameToPromote: usernameToPromote,
         })
       });
       let data = await response.json();
       return data.wasSuccessfull;
     }

     /**
      * This function is used to reset the password of a certain user, it calls the supabase handler (resetPassword.ts)
      * @param userToken 
      * @param usernameToReset 
      * @returns 
      */
     public resetPassword = async (userToken: string, usernameToReset: string | undefined): Promise<boolean> => {
      let response = await fetch('./api/users/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userToken: userToken,
          usernameToReset: usernameToReset,
        })
      });
      let data = await response.json();
      return data.wasSuccessfull;  
     }
   
     /**
      * This method is used to demote a certain User
      */
      public demoteUser = async (userToken: string, usernameToDemote: string | undefined): Promise<boolean> => {
       let response = await fetch('./api/users/demote', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           userToken: userToken,
           usernameToDemote: usernameToDemote,
         })
       });
       let data = await response.json();
       return data.wasSuccessfull;
     }
   
  /**
 * This mehtod loggs out the current user.
 * @returns {boolean} True if logout was successfull, false if not
 */
  public logoutUser = (): boolean => {
    localStorage.removeItem("DevChat.auth.token")
    if (localStorage.getItem("DevChat.auth.token") == null) {
      return true;
    }
    return false;
  }

  /**
   * This method deletes a target user.
   * @param {string} userToken token for user verification
   * @param {string} usernameTodelete username of user that should be deleted
   * @returns {Promise<boolean>} true if target user was deleted, false if not
   */
  public deleteUser = async (userToken: string, usernameToDelete: string | undefined): Promise<boolean> => {
    let response = await fetch('./api/users/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        usernameToDelete: usernameToDelete,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This method changes the password from the current user.
   * @param {string} userToken current UserToken
   * @param {string} oldPassword old Password from the user
   * @param {string} newPassword new Password for the user
   * @returns {Promise<boolean>} true if password was succesfully changed
   */
  public changePassword = async (userToken: string, oldPassword: string, newPassword: string): Promise<boolean> => {
    let response = await fetch('./api/users/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userToken: userToken,
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
 * This method logs a user in if there is a match with the database. Therfore a token is created which is stored in the browsers local storage.
 * @param {string} username Username to log in
 * @param {string} password Password for user
 * @returns {Promise<boolean>} True if login was successfull, false if not
 */
  public loginUser = async (username: string, password: string): Promise<boolean> => {
    let response = await fetch('./api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    let data = await response.json();
    if (data.userToken === "") {
      localStorage.removeItem("DevChat.auth.token")
      return false;
    }
    localStorage.setItem("DevChat.auth.token", data.userToken)
    return true;
  }

  /**
   * This method registers a user to the database
   * @param {string} username the username of the user to be created
   * @param {string} password the password of the user to be created
   * @returns {Promise<string>} true if registration was successfull, error message if not
   */
  public registerUser = async (username: string, password: string): Promise<string> => {
    let response = await fetch('./api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })
    });
    let data = await response.json();
    console.log("Controller.data.wasSuccessfull " + data.wasSuccessfull)
    if (data.wasSuccessfull == "True") {
      let controller = new FrontEndController;
      await controller.loginUser(username, password);
    }
    return data.wasSuccessfull;
  }

  /**
   * This method checks the database for a user with the given username
   * @param {string} username Username to check
   * @returns {Promise<boolean>} True if user already exists, false if not
   */
  public userAlreadyExists = async (username: string): Promise<boolean> => {
    let response = await fetch('./api/users/user_already_exists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  //#endregion

  //#region Token Methods

  /**
   * This mehtod returns the current user token safed in local storage
   * @returns {string} token of the currently logged in user
   */
  public getUserToken = (): string => {
    let userToken = localStorage.getItem("DevChat.auth.token");
    if (userToken === null) {
      return ""
    }
    return userToken;
  }

  /**
   * This method extracts the username from the token and returns it.
   * @param {string} token Token with user information
   * @returns {string} Username if token contains username, else empty string
   */
  public getUserFromToken = (token: string): string => {
    let content = jwt.decode(token)
    if (typeof content === "object" && content !== null) {
      return content.username;
    }
    // error case
    return "";
  }

  public getAdminValueFromToken = (token: string): boolean => {
    let content = jwt.decode(token)
    if (typeof content === "object" && content !== null) {
      return content.isAdmin;
    }
    return false;
  }

  /**
   * This method checks whether the given token has a valid signature and user
   * @param {string} token token to be verified
   * @returns {Promise<boolean>} true if signature is valid and user exists, false if not
   */
  public verifyUserByToken = async (token: string): Promise<boolean> => {
    let response = await fetch('./api/users/verify_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
      })
    });
    let data = await response.json();
    return data.isVerified;
  }

  //#endregion

}
// export the controller
export default new FrontEndController();