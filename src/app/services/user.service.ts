import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  signUp(user: User): Observable<User> {
    // Hash the password before saving
    // const hashedPassword = bcrypt.hashSync(user.password, 10);
    // const newUser = { ...user, password: hashedPassword };
    return this.http.post<User>(this.apiUrl, user);
    return this.http.post<User>(this.apiUrl, newUser);
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
}