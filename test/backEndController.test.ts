/**
 * Hello Guys (and Girls) :).
 * 
 * To use this unittest you have to rename the "TEST_babel.config.js" file to "babel.config.js".
 * Then you can run the unittests by type following in the terminal and fire with enter:
 * "npm run test"
 * 
 * After editing the unittest you have to change the name of the "babel.config.js" file to "TEST_babel.config.js" back again.
 * Only if you to that you are allowed to push your changes!!!!!!!!
 * If you push your changes without that step our dev server will be fucked!
 * 
 * Happy Unit Testing!
 */


import { BackEndController } from '../controller/backEndController';
import { ProDemote } from '../enums/accessLevel';

const controller = new BackEndController();

const invalidUserToken = "eyJhbGciOiJIdsfafsUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaGFubmVzIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY0NjMwNzQxNywiZXhwIjoxNjQ2MzkzODE3fQ.CUHeOP_Mei82UKjp14_MvujUibt6oFepSQtdM4KaroU";

// NOTE: maybe change bc of hash change
const validAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkR1bW15QWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2NDYzMjIxMDQsImV4cCI6MTY0NjQwODUwNH0.Gm11yjCgDSGnb9NmrQP43VMvzP3qgEpriZFbDk3Yey0";

const dummyValidUser = {
  name: "dummy",
  password: "Dummy!809",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImR1bW15IiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY0NjMyMDg3MiwiZXhwIjoxNjQ2NDA3MjcyfQ.-WXMAkUmzshb7AcM2c7DiYDpVRnbxkPR6Pzm2uYztMw",
  // idInDB: 1,
};


describe('The BackEndController should work as expected', () => {
  
  /*
  unittest all public methods frhom the BackEndController:
  ( maybe not all :) )

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
    expect(await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password)).not.toBe('');
    expect(await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password)).toContain('eyJhbGciOiJI');
  });
  

  it('BackEndController.handleChangeUserPassword()', async () => {
    const newInvalidPassword = '123456789';
    const newValidPassword = 'Test!809';

    // check with valid old password and valid new password
    expect(await controller.handleChangeUserPassword(dummyValidUser.token, dummyValidUser.password, newValidPassword)).toBeTruthy();
    expect(await controller.handleLoginUser(dummyValidUser.name, newValidPassword)).not.toBe('');
    expect(await controller.handleLoginUser(dummyValidUser.name, newValidPassword)).toContain('eyJhbGciOiJI');
    expect(await controller.handleChangeUserPassword(dummyValidUser.token, newValidPassword, dummyValidUser.password)).toBeTruthy();
    expect(await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password)).not.toBe('');
    expect(await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password)).toContain('eyJhbGciOiJI');

    // check with valid old password and invalid new password
    expect(await controller.handleChangeUserPassword(dummyValidUser.token, dummyValidUser.password, newInvalidPassword)).toBeFalsy();
    expect(await controller.handleLoginUser(dummyValidUser.name, newInvalidPassword)).toBe('');

    // check with invalid old password and valid new password
    expect(await controller.handleChangeUserPassword(dummyValidUser.token, 'wrongPassword', newValidPassword)).toBeFalsy();
    expect(await controller.handleLoginUser(dummyValidUser.name, newValidPassword)).toBe('');

    // check with invalid old password and invalid new password
    expect(await controller.handleChangeUserPassword(dummyValidUser.token, 'wrongPassword', newInvalidPassword)).toBeFalsy();
    expect(await controller.handleLoginUser(dummyValidUser.name, newInvalidPassword)).toBe('');
  });


  it('BackEndController.handleDeleteUser()', async () => {

    // delete himself
    expect(await controller.handleDeleteUser(dummyValidUser.token, dummyValidUser.name)).toBeTruthy();
    expect(await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password)).toBe('');
    expect(await controller.handleRegisterUser(dummyValidUser.name, dummyValidUser.password)).not.toBe('');
    expect(await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password)).not.toBe('');
    expect(await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password)).toContain('eyJhbGciOiJI');
    
    // delete other user
    expect(await controller.handleDeleteUser(invalidUserToken, dummyValidUser.name)).toBeFalsy();
    expect(await controller.handleDeleteUser(dummyValidUser.token, 'wrongUser')).toBeFalsy();

    // delete other user as admin
    expect(await controller.handleDeleteUser(validAdminToken, dummyValidUser.name)).toBeTruthy();
    expect(await controller.handleRegisterUser(dummyValidUser.name, dummyValidUser.password)).not.toBe('');
  });


  it('BackEndController.handleUpdateUserAccessLevel()', async () => {
    expect(await controller.handleUpdateUserAccessLevel(dummyValidUser.token, dummyValidUser.name, ProDemote.PROMOTE)).toBeFalsy();
    expect(await controller.handleUpdateUserAccessLevel(dummyValidUser.token, dummyValidUser.name, ProDemote.DEMOTE)).toBeFalsy();
    
    expect(await controller.handleUpdateUserAccessLevel(validAdminToken, dummyValidUser.name, ProDemote.PROMOTE)).toBeTruthy();
    let newToken = await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password);
    expect(controller.getIsAdminFromToken(newToken)).toBeTruthy();
    expect(await controller.isUserTokenValid(newToken)).toBeTruthy();

    expect(await controller.handleUpdateUserAccessLevel(validAdminToken, dummyValidUser.name, ProDemote.DEMOTE)).toBeTruthy();
    newToken = await controller.handleLoginUser(dummyValidUser.name, dummyValidUser.password);
    expect(controller.getIsAdminFromToken(newToken)).toBeFalsy();
    expect(await controller.isUserTokenValid(newToken)).toBeTruthy();

    expect(controller.getIsAdminFromToken(dummyValidUser.token)).toBeFalsy();
    expect(await controller.isUserTokenValid(dummyValidUser.token)).toBeTruthy();
  });



});
