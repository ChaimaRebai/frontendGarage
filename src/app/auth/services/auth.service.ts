import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';

// Types
export interface User {
  id: string;
  email: string;
  role: 'client' | 'professional' | 'admin';
}

interface AuthResponse {
  user: User;
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // a modifierrr !!!!!!!!! api url 
  private readonly API_URL = 'http://your-api-url.com/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
   }

   // ----------------- Auth Methods -----------------
  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => this.setSession(response)),
        map(response => response.user)
      );
  }

  register(userData: any): Observable<User> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => this.setSession(response)),
        map(response => response.user)
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ----------------- Helper Methods -----------------
  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ----------------- Guard Helpers -----------------
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === requiredRole : false;
  }

  // ----------------- Token Refresh -----------------
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {
      token: this.getToken()
    }).pipe(
      tap(response => this.setSession(response))
    );
  }
}
