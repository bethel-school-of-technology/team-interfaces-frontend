import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  signUp(user: User): Observable<User> {
    // Hash the password before saving
    // const hashedPassword = bcrypt.hashSync(user.password, 10);
    // const newUser = { ...user, password: hashedPassword };
    return this.http.post<User>(this.apiUrl, user);
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, {
      username,
      password
    });
  }

  // Add this method to verify password
  private verifyPassword(storedPassword: string, providedPassword: string): boolean {
    return bcrypt.compareSync(providedPassword, storedPassword);
  }

  listOfUsers(): User[] {
    // Implementation for getting list of users
    return [];
  }
}