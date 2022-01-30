import { setCookies, getCookies, getCookie, removeCookies, checkCookies } from 'cookies-next';

/**
 * This is the controller of the DEV-CHAT-APP.
 */
export class DevChatController {
    private data: any;

    constructor() {
        console.log("DevChatController.constructor()");
        this.data = {
            message: 'Hello, this is the controller of the DEV-CHAT-APP.'
        };

        this.initilize(); // call the async method to initialize the controller
    }

    /**
     * This method is used to initialize the controller.
     * It is called by the constructor.
     * It is async because it needs to wait for the cookies and the supabase data to be loaded.
     */
    public async initilize() {
        console.log("DevChatController.initilize()");
        await this.checkCookies(); // here should the controller check for user cookies and if there are cookies, the user should be logged in.
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
     * This method is used to process a new message which is entered in the Chat.
     * @param message The input string of the user which should be processed.
     */
    public async enteredNewMessage(message: string) {
        console.log("DevChatController.enteredNewMessage()");
        console.log("in Controller: " + message);
        if(await this.checkMessageForCommands(message) == false)
        {   
            //Add the Message to the Database
            // userId: 2 --> Wildcard
            // chatKeyId: 2 --> Wildcard
            this.addChatMessage(message,"2","2");
        }
    }

    /**
     * Checks the Message if its a Command
     * @param message Input Messag zu Check
     */
    private async checkMessageForCommands(message: string): Promise<boolean> {
        var isMessageCommand : boolean = false;
        console.log("DevChatController.checkMessageForCommands()");
        console.log("is Command: " + isMessageCommand);
        //Task in Sprint 2
        return isMessageCommand;
    }

    /**
     * This method should update the data of the chat.
     */
    public async updateChatMessages() {
        console.log("DevChatController.updateChatMessages()");

    }


    public async userLogsIn(username: string, password: string): Promise<boolean> {
        console.log("DevChatController.userLogsIn()");
        var loginWasSuccessful: boolean = false;

        return loginWasSuccessful;
    }


    public async userRegisters(username: string, password: string): Promise<boolean> {
        console.log("DevChatController.userRegisters()");
        var registerWasSuccessful: boolean = false;

        return registerWasSuccessful;
    }

    /**
     * This is a function that removes a user from the database
     * @param {string} username the username of the user to be removed
     * @param {string} password the password of the user to be removed
     * @returns {Promise<boolean>} true if the user was removed, false if the user was not found or the password was wrong
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