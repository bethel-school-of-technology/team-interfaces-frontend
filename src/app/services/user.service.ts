import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user';
import { ChartDataPoint } from '../models/chart-data-point';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;
  
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    if (this.isBrowser) {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
    
  }

  signUp(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap((user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  listOfUsers(): User[] {
    return [];
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  updateUserById(userId: number|undefined, updatedUser: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, { balance: updatedUser.balance });
  }

  updateUserInfo(userId: number|undefined, updatedUser: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, {email: updatedUser.email, name: updatedUser.name, bankAccount: updatedUser.bankAccount});
  }

  updateUserPassWord(userId: number|undefined, updatedUser: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, {email: updatedUser.email, password: updatedUser.password, name: updatedUser.name, bankAccount: updatedUser.bankAccount});
  }

  GetChartInfo(userId: number): Observable<ChartDataPoint[]> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get<ChartDataPoint[]>(
      `${this.apiUrl}/cryptos/?user_id=${userId}`,
      { params }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching chart data:', error);
        return throwError(() => new Error('Failed to fetch chart data'));
      })
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Logout error:', error);
        localStorage.removeItem('currentUser');
        return throwError(() => new Error('Logout failed'));
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}