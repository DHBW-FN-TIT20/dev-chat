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
    public async initilize() {
        console.log("DevChatController.initilize()");
        var Cookies = checkCookies('userKey'); // here should the controller check for user cookies and if there are cookies, the user should be logged in.
        if(Cookies){
        console.log("Cookies have been set, you are being logged in." + Cookies);
        var userPass = await getCookie('userKey');
        var userName = await getCookie('passwordKey');
        console.log(String(userPass) + "  " + String(userName));
        this.userLogsIn(String(userName),String(userPass));
        // aktiven User setzen?
        }
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

    public async userLogsIn(username: string, password: string): Promise<boolean> {
        console.log("DevChatController.userLogsIn()");
        var loginWasSuccessful: boolean = await this.verifyUser(username,password); // Verify User
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

    public async userLogsOut(){
        removeCookies('userKey');
        removeCookies('passwordKey');
        console.log("Cookies have been removed");
        var loginPage = '/../login';
        window.location.href = loginPage
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
    public verifyUser = async (username: string, password:string): Promise<boolean> => {
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


}


// export the controller
export default new DevChatController();