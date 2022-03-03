import { BackEndController } from '../controller/backEndController';

const controller = new BackEndController();

const invalidUserToken = "eyJhbGciOiJIdsfafsUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaGFubmVzIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY0NjMwNzQxNywiZXhwIjoxNjQ2MzkzODE3fQ.CUHeOP_Mei82UKjp14_MvujUibt6oFepSQtdM4KaroU";

// NOTE: maybe change bc of hash change
const validAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjQ2MzE0ODg0LCJleHAiOjE2NDY0MDEyODR9.fS2GDHnP9kwhkQ_g_IouKjlkENtJW0aVvKcxoNpFuWg";

const dummyValidUser = {
  name: "dummy",
  password: "Dummy!809",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImR1bW15IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY0NjMxNjgzOSwiZXhwIjoxNjQ2NDAzMjM5fQ.8bTQR4Pi-7sxn-GUZiRzRx-dlU35PamGXHMUqbNF5qE",
  // idInDB: 1,
};


describe('The BackEndController should work as expected', () => {
  
  /*
  unittest all public methods frhom the BackEndController:

    constructor()
    public isTokenValid(token: string): boolean
    public async isUserTokenValid(token: string): Promise<boolean>
    public getUsernameFromToken(token: string): string
    public getIsAdminFromToken(token: string): boolean
    public isPasswordValid(password: string): boolean
    public async handleChangeUserPassword(token: string, oldPassword: string, newPassword: string): Promise<boolean>
    public async handleDeleteUser(userToken: string, usernameToDelete: string): Promise<boolean>
    public async handleUpdateUserAccessLevel(token: string, nameToPromote: string, proDemote: ProDemote): Promise<boolean>
    public async handleGetAllUsers(token: string): Promise<IUser[]>
    public async handleLoginUser(username: string, password: string): Promise<string>
    public async handleRegisterUser(username: string, password: string, accessLevel: AccessLevel = AccessLevel.USER): Promise<string>
    public async handleResetUserPassword(token: string, name: string): Promise<boolean>
    public async handleUserAlreadyExists(username: string): Promise<boolean>
    public isUsernameValid(username: string): boolean
    public async handleAddCustomChatKey(userToken: string, keyword: string): Promise<boolean>
    public async handleChangeChatKeyExpirationDate(token: string, chatKeyID: number, newExpirationDate: Date): Promise<boolean>
    public async handleDeleteOldChatKeys(): Promise<boolean>
    public async handleDeleteChatKey(userToken: string, chatKeyID: number): Promise<boolean>
    public async handleDoesChatKeyExist(chatKey: string): Promise<boolean>
    public async handleGenerateChatKey(): Promise<string>
    public async handleGetAllChatKeys(token: string): Promise<IChatKey[]>
    public async addChatKey(chatKey: string): Promise<boolean>
    public async handleGetChatMessages(token: string, keyword: string, lastMessageID: number): Promise<IFChatMessage[]>
    public async handleJoinLeaveRoomMessage(userToken: string, keyword: string, joinOrLeave: string): Promise<boolean>
    public async handleSaveChatMessage(message: string, keyword: string, userToken: string): Promise<boolean>
    public async addChatMessage(message: string, chatKeyId: number, userId: number, targetUserId: number = SystemUser.BROADCAST): Promise<boolean>
    public async handleChangeTicketSolvedState(currentToken: string, ticketToChange: number, currentState: boolean): Promise<boolean>
    public async handleGetAllTickets(token: string): Promise<IBugTicket[]>
    public async handleChangeSurveyExpirationDate(token: string, surveyID: number, newExpirationDate: Date): Promise<boolean>
    public async handleDeleteSurvey(userToken: string, surveyIDToDelete: number): Promise<boolean>
    public async handleGetAllSurveys(adminToken: string): Promise<ISurvey[]>
    public async getSurveyState(surveyID: number, chatKeyID: number): Promise<ISurveyState | null>
    public async addNewVote(voteToAdd: ISurveyVote): Promise<boolean>
    public async isSurveyExpired(surveyID: number): Promise<boolean>

  */

  it('BackEndController.constructor()', () => {
    expect(controller).toBeDefined();
  });

  it('BackEndController.isTokenValid()', () => {
    expect(controller.isTokenValid(dummyValidUser.token)).toBeTruthy();
    expect(controller.isTokenValid(invalidUserToken)).toBeFalsy();
  });

  it('BackEndController.isUserTokenValid()', async () => {
    expect(await controller.isUserTokenValid(dummyValidUser.token)).toBeTruthy();
    expect(await controller.isUserTokenValid(invalidUserToken)).toBeFalsy();
  });

  it('BackEndController.getUsernameFromToken()', () => {
    expect(controller.getUsernameFromToken(dummyValidUser.token)).toBe(dummyValidUser.name);
  });

  it('BackEndController.getIsAdminFromToken()', () => {
    expect(controller.getIsAdminFromToken(validAdminToken)).toBeTruthy();
    expect(controller.getIsAdminFromToken(dummyValidUser.token)).toBeFalsy();
    expect(controller.getIsAdminFromToken(invalidUserToken)).toBeFalsy();
  });

  it('BackEndController.isPasswordValid()', () => {
    expect(controller.isPasswordValid('Test!809')).toBeTruthy();
    expect(controller.isPasswordValid('123456789')).toBeFalsy();
    expect(controller.isPasswordValid('abc')).toBeFalsy();
    expect(controller.isPasswordValid('abcdefghijklmnopqrstuvwxyz')).toBeFalsy();
    expect(controller.isPasswordValid('abcdefghijklmnopq!rstuvwx32413')).toBeFalsy();
    expect(controller.isPasswordValid('abcdefghi)jklmnopqrstuvwx32413')).toBeFalsy();
    expect(controller.isPasswordValid('Abcdefghijklmnopqrstuvwx32413')).toBeFalsy();
    expect(controller.isPasswordValid('Abcdefg!hijklmnopqrst[]uvwx32413')).toBeFalsy();
  });

  // NOTE: now the difficult part comes

  it('BackEndController.handleLoginUser()', async () => {
    expect(await controller.handleLoginUser(dummyValidUser.name, 'wrongPassword')).toBe('');
    expect(await controller.handleLoginUser('wrongUser', dummyValidUser.password)).toBe('');
  });



});
