import { Crypto } from "./crypto";

export class User {
    id: number|undefined;
    password: string = '';
    name: string = '';
    email: string = '';
    bankAccount: string = '';
    balance: number = 0.00;
    coin: Crypto[] = [];
}
