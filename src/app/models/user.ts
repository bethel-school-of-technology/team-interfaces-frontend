import { Crypto } from "./crypto";

export class User {
    id: number = 0;
    password: string = '';
    name: string = '';
    email: string = '';
    bankAccount: string = '';
    balance: number = 0.00;
    coin: Crypto[] = [];
}
