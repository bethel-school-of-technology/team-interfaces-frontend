import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { Crypto } from '../models/crypto';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';


  constructor(private http: HttpClient) { }


  signUp(user: User): Observable<User> {
   
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, {
      email,
      password
    });
 }

  listOfUsers(): User[] {
    return [];
  }

  getCurrentUser(userId: number ) {
   
    return this.http.get(`${this.apiUrl}/users/${userId}`)
  }



 
}