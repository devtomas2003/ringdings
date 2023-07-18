export interface ILineInfo {
    msisdn: string;
    activated: boolean;
    ringActived: string;
    accountId: string;
    extraCall: boolean;
}

export interface IRingDings {
    ringId: string;
    ringName: string;
    ringAuthor: string;
    coverPath: string;
    price: string;
}