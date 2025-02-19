import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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

  getCurrentUser(userId?: number): Observable<User> {
    if (userId) {
      return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return new Observable<User>(observer => {
      observer.next(currentUser as User);
      observer.complete();
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Logout error:', error);
        localStorage.removeItem('currentUser');
        return throwError(() => new Error('Logout failed'));
      })
    );
  }
}