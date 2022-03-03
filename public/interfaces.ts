//#region DB interfaces

import { AccessLevel } from "../enums/accessLevel";

//#region ChatKey

export interface IChatKey {
  id: number;
  keyword: string;
  expirationDate: Date;
};

export var emptyChatKey: IChatKey = {
  id: NaN,
  keyword: "",
  expirationDate: new Date(0),
};

//#endregion

//#region ChatMessage

export interface IChatMessage {
  id: number;
  chatKeyID: number;
  userID: number;
  targetUserID: number;
  dateSend: Date;
  message: string;
};

export var emptyChatMessage: IChatMessage = {
  id: NaN,
  chatKeyID: NaN,
  userID: NaN,
  targetUserID: NaN,
  dateSend: new Date(0),
  message: "",
};

//#endregion

//#region Survey

export interface ISurvey {
  id: number;
  name: string;
  description: string;
  expirationDate: Date;
  ownerID: number;
  chatKeyID: number;
};

export var emptySurvey = {
  id: NaN,
  name: "",
  description: "",
  expirationDate: new Date(0),
  ownderID: NaN,
  chatKeyID: NaN,
};

export interface ISurveyOption {
  id: number;
  surveyID: number;
  name: string;
};

export var emptySurveyOption: ISurveyOption = {
  id: NaN,
  surveyID: NaN,
  name: "",
};

export interface ISurveyVote {
  surveyID: number;
  userID: number;
  optionID: number;
};

export var emptySurveyVote: ISurveyVote = {
  surveyID: NaN,
  userID: NaN,
  optionID: NaN,
};

//#endregion

//#region Ticket

export interface IBugTicket {
  id: number;
  submitterID: number;
  createDate: Date;
  message: string;
  solved: boolean;
};

export var emptyBugTicket: IBugTicket = {
  id: NaN,
  submitterID: NaN,
  createDate: new Date(0),
  message: "",
  solved: false,
};

//#endregion

//#region User

export interface IUser {
  /** 
   * user.id=0 -> broadcast
   * user.id=1 -> system
   * user.id=2 -> admin (master-account)
   */
  id: number;
  name: string;
  hashedPassword: string;
  accessLevel: AccessLevel;
};

export var emptyUser: IUser = {
  id: NaN,
  name: "",
  hashedPassword: "",
  accessLevel: NaN,
};

//#endregion

//#endregion

//#region custom interfaces

// Survey with votes (Survey State)
export interface ISurveyState {
  survey: ISurvey;
  options: {
    option: ISurveyOption, votes: number
  }[];
}

// Chat message object for HMI
export interface IFChatMessage {
  id: number;
  username: string;
  dateSend: Date;
  message: string;
};

//#endregion