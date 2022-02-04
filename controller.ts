import { setCookies, getCookies, getCookie, removeCookies, checkCookies} from 'cookies-next';
import { IChatMessage } from './public/interfaces';


/**
 * This is the controller of the DEV-CHAT-APP.
 */
export class DevChatController {
  private data: any;
  public chatMessages: IChatMessage[] = [];
  private chatMessageInterval: any;

  constructor() {
    console.log("DevChatController.constructor()");
    this.data = {
      message: 'Hello, this is the controller of the DEV-CHAT-APP.'
    };

    this.initialize(); // call the async method to initialize the controller
  }

  /**
   * This method is used to initialize the controller.
   * It is called by the constructor.
   * It is async because it needs to wait for the cookies and the supabase data to be loaded.
   */
  public async initialize() {
    console.log("DevChatController.initialize()");
    var Cookies = checkCookies('userKey'); // here should the controller check for user cookies and if there are cookies, the user should be logged in.
    if(Cookies) {
      console.log("Cookies have been set, you are being logged in." + Cookies);
      var userPass = await getCookie('userKey');
      var userName = await getCookie('passwordKey');
      console.log(String(userPass) + "  " + String(userName));
      this.userLogsIn(String(userName),String(userPass));
      // aktiven User setzen?
    }
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
    if(await this.checkMessageForCommands(message) == false) {   
      // NOTE: getCookies function here?!
      // Add the Message to the Database
      // userId: 2 --> Wildcard
      // chatKeyId: 2 --> Wildcard
      this.addChatMessage(message,"2","2");
    }
  }

  /**
   * Function to create a Chat Room
   */
   public CreateChatRoom() {
    this.addChatKey();
  }

  /**
   * Function to create a ChatKey
   * @returns {Promise<boolean>} true if the chatkey was created, false if the chat Key was not created
  **/
   private addChatKey = async (): Promise<boolean> => {
    let response = await fetch('./api/chatkeys/save_chat_key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },      
    });
    let data = await response.json();
    console.log("addChatKey(): "+ data.wasSuccessfull);   
    return data.wasSuccessfull;
  }

  /**
   * NOTE: Not needed in frontend?!
   * Checks if the message is a command
   * @param {string} message Input messag to check
   * @returns {Promise<boolean>} True if it is a Command, false if not
   */
  private async checkMessageForCommands(message: string): Promise<boolean> {
    var isMessageCommand : boolean = false;
    console.log("DevChatController.checkMessageForCommands()");
    console.log("is Command: " + isMessageCommand);
    //Task in Sprint 2
    return isMessageCommand;
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
    
    // get the new messages
    let newMessages: IChatMessage[] = await this.fetchChatMessages(5, "johannes", "FatherMotherBread", lastMessageId);

    // console.log("newMessages: ");
    // console.table(newMessages);

    // add the new messages to the chat messages
    this.chatMessages = this.chatMessages.concat(newMessages);

  }

  /**
   * This method is used to check if there are cookies.
   * If there are cookies, the user should be logged in.
   */
  private async checkCookies() {
    console.log("DevChatController.checkCookies()");
    console.table(getCookies());
  }
  
  /**
   * This method registers a user.
   * @param {string} username Username to register
   * @param {string} password Password for user
   * @returns {Promise<boolean>} True if registration was successfull, false if not
   */
  public async userRegisters(username: string, password: string): Promise<boolean> {
    console.log("DevChatController.userRegisters()");

    let response = await fetch('./api/users/register_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This function is used to get the chat messages from the database.
   * @param {number} targetID the id of the user who is logged in
   * @param {string} targetPassword the password of the user who is logged in
   * @param {string} chatKey the three-word of the chat
   * @param {number} lastMessageID the id of the last message that was received
   * @returns {Promise<IChatMessage[]>} Fetched messages from database
   */
  public fetchChatMessages = async (targetID: number, targetPassword: string, chatKey: string, lastMessageID: number = 0): Promise<IChatMessage[]> => {
    console.log("DevChatController.fetchChatMessages()");
    let chatMessages: IChatMessage[] = [];
    
    let response = await fetch('./api/messages/get_chat_messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetID: targetID,
        targetPassword: targetPassword,
        chatKey: chatKey,
        lastMessageID: lastMessageID
      })
    });
    let data = await response.json();

    chatMessages = data.chatMessages;

    return chatMessages;
  }

  /**
   * This method logs a user in and creates the necessary cookies.
   * @param {string} username Username to log in
   * @param {string} password Password for user
   * @returns {Promise<boolean>} True if login was successfull, false if not
   */
  public async userLogsIn(username: string, password: string): Promise<boolean> {
    console.log("DevChatController.userLogsIn()");
    var loginWasSuccessful: boolean = await this.verifyUser(username, password); // Verify User
    if(loginWasSuccessful){
      console.log("Login was successful. (Operation: userLogsIn)");
      setCookies('userKey', username); //  set Cookie for login session, if user login was successful
      setCookies('passwordKey', password);
      console.log("Cookies have been set");
    }
    else {
      console.log("Login was not successful. (Operation: userLogsIn)");
    }
    return loginWasSuccessful;
  }
  
  /**
   * This method logs the user out and removes the relating cookies.
   */
  public async userLogsOut(){
    removeCookies('userKey');
    removeCookies('passwordKey');
    console.log("Cookies have been removed");
    var loginPage = '/../login';
    window.location.href = loginPage
  }

  /**
   * This is a function that removes a user from the database
   * @param {string} username the username of the user to be removed
   * @param {string} password the password of the user to be removed
   * @returns {Promise<boolean>} true if the user was removed, false if the user was not found or the password was wrong
   **/
  public deleteUser = async (currentUserId: number, currentUserPassword: string, usernameToDelete: string): Promise<boolean> => {
    let response = await fetch('./api/delete_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentUserId: currentUserId,
        currentUserPassword: currentUserPassword,
        usernameToDelete: usernameToDelete
      })
    });
    let data = await response.json();
    return data.wasSuccessfull;
  }

  /**
   * This is a function that veryfies a user
   * @param {string} username the username of the user to be removed
   * @param {string} password the password of the user to be removed
   * @returns {Promise<boolean>} true if the user was successfully verified, false if the user was not found or the password was wrong
   **/
  public verifyUser = async (username: string, password: string): Promise<boolean> => {
    let response = await fetch('./api/users/verify_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    let data = await response.json();
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
   * This is a function that adds a message to the database
   * @param {string} message the message of the user to added
   * @param {string} userId the userId of the user who sends the message
   * @param {string} chatKeyId the id of the chatroom
   * @returns {Promise<boolean>} true if the user was removed, false if the user was not found or the password was wrong
  **/
  public addChatMessage = async (message: string, userId: string, chatKeyId:string ): Promise<boolean> => {
    let response = await fetch('./api/messages/save_chat_message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        userId: userId,
        chatKeyId: chatKeyId
      })
    });
    let data = await response.json();
    console.log("addChatMessage("+message+"): "+ data.wasSuccessfull);
    return data.wasSuccessfull;
  }

}
// export the controller
export default new DevChatController();