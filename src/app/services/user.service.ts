import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    listOfUsers: User[] = [{
        id: 1,
        username: "bob1",
        password: "bob#password",
        name: "Bob Smith",
        email: "bsmith@exp.com",
        bankAccount: "123456789",
        balance: 1000.00
    }, {
        id: 2,
        username: "ape2",
        password: "apr#password",
        name: "April Jones",
        email: "ajones@exp.com",
        bankAccount: "234567891",
        balance: 2000.00
    }, {
        id: 3,
        username: "Jim3",
        password: "jim#password",
        name: "Jim Adams",
        email: "jadams@exp.com",
        bankAccount: "345678912",
        balance: 3000.00
    }];

    title: string = "My Users";

    signUp(newUser: User): Observable<User> {
        // Add the new user to the list
        this.listOfUsers.push(newUser);
        // Return the added user as an Observable
        return of(newUser);
    }
}