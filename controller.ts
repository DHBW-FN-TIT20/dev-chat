import { setCookies, getCookies, getCookie, removeCookies, checkCookies} from 'cookies-next';

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
    private async initilize() {
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
     * This method is used to process a new message.
     * @param message The input string of the user which should be processed.
     */
    public async enteredNewMessage(message: string) {
        console.log("DevChatController.enteredNewMessage()");
        console.log("in Controller: ", message);
    }

    /**
     * This method should update the data of the chat.
     */
    public async updateChatMessages() {
        console.log("DevChatController.updateChatMessages()");
        
    }
}


// export the controller
export default new DevChatController();