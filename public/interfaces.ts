// ChatKey

export interface IChatKey {
    id: number;
    threeWord: string;
    expirationDate: Date; // maybe change later
}

export var emptyChatKey: IChatKey = {
    id: 0,
    threeWord: "",
    expirationDate: new Date(0), // maybe change later
};


// User:

export interface IUser {
    /** 
     * user.id=0 -> broadcast
     * user.id=1 -> system
     * user.id=2 -> admin (master-account)
     */
    id: number;
    name: string;
    hashedPassword: string;
    accessLevel: number;
}

export var emptyUser: IUser = {
    id: 0,
    name: "",
    hashedPassword: "",
    accessLevel: 0,
};


// SurveyOption

export interface ISurveyOption {
    id: number;
    name: string;
}

export var emptySurveyOption: ISurveyOption = {
    id: 0,
    name: "",
};


// ChatMessage

export interface IChatMessage {
    id: number;
    chatKey: IChatKey;
    user: IUser; // maybe change to sender
    target: IUser;
    date: Date; // maybe change later
    message: string;
}

export var emptyChatMessage: IChatMessage = {
    id: 0,
    chatKey: emptyChatKey,
    user: emptyUser,
    target: emptyUser,
    date: new Date(0), // maybe change later
    message: "",
};


// SurveyVote

export interface ISurveyVote {
    user: IUser;
    option: ISurveyOption;
}

export var emptySurveyVote: ISurveyVote = {
    user: emptyUser,
    option: emptySurveyOption,
};


// Survey

export interface ISurvey {
    id: number;
    name: string;
    description: string;
    expirationDate: Date;
    owner: IUser;
    options: ISurveyOption[];
    votes: ISurveyVote[];
}

export var emptySurvey: ISurvey = {
    id: 0,
    name: "",
    description: "",
    expirationDate: new Date(0), // maybe change later
    owner: emptyUser,
    options: [],
    votes: [],
};


// BugTicket

export interface IBugTicket {
    id: number;
    submitter: IUser;
    date: Date; // maybe change later
    message: string;
    solved: boolean;
}

export var emptyBugTicket: IBugTicket = {
    id: 0,
    submitter: emptyUser,
    date: new Date(0), // maybe change later
    message: "",
    solved: false,
};