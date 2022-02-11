import jwt from 'jsonwebtoken'
import { setCookies, getCookies, getCookie, removeCookies, checkCookies} from 'cookies-next';
import { IChatMessage } from './public/interfaces';
import chat from './pages/chat';


/**
 * This is the controller of the DEV-CHAT-APP.
 */
export class DevChatController {
  private data: any;
  public chatMessages: IChatMessage[] = [];
  private chatMessageInterval: any;
  private chatKeyCookieName: string = "DevChat.ChatKey";

  constructor() {
    console.log("DevChatController.constructor()");
    this.data = {
      message: 'Hello, this is the controller of the DEV-CHAT-APP.'
    };
  }

  /**
   * Function to start fetching messages from the Database
   */
  public async startMessageFetch() {
    // Update chat messages every 2 sec. 
    this.chatMessageInterval = setInterval(async () => {
      this.updateChatMessages();
    }, 2000);
  }

  /**
   * Function to stop fetching messages from the Database
   */
  public stopMessageFetch() {
    clearInterval(this.chatMessageInterval);
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
    if(data.wasSuccessfull == true)
    {
      this.setChatKeyCookie(data.newChatKey);
    }
    return data.wasSuccessfull;
  }

  /**
   * This method updates the data of the chat.
   */
  public async updateChatMessages() {
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

  }

  /**
   * This method creates a cookie with the given chat key as value
   * @param {string} chatKey Value for cookie
   */
  public setChatKeyCookie(chatKey: string) {
    console.log("setChatKeyCookie("+ chatKey+")")
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

  /**
   * This is a function that adds a message to the database
   * @param {string} message the message of the user to added
   * @param {string} userToken the user token of the user who sends the message (logged in)
   * @param {string} chatKey the chat key of the chatroom
   * @returns {Promise<boolean>} true if the message was send, false if not
  **/
  public addChatMessage = async (message: string, userToken: string, chatKey:string ): Promise<boolean> => {
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
    console.log("addChatMessage("+message+"): "+ data.wasSuccessfull);
    return data.wasSuccessfull;
  }

  //#region User Methods

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
    console.log("Controller.data.wasSuccessfull "+data.wasSuccessfull)
    if (data.wasSuccessfull == "True") {
      let controller = new DevChatController;
      await controller.loginUser(username, password);
    }
    return data.wasSuccessfull;    
  }

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
  public deleteUser = async (userToken: string, usernameToDelete: string): Promise<boolean> => {
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

  //#endregion

}
// export the controller
export default new DevChatController();