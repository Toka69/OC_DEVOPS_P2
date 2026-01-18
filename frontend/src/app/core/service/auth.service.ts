// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialLoginState();
  }

  public checkInitialLoginState(): void {
    const token = localStorage.getItem('token');
    this.isLoggedInSubject.next(!!token);
  }

  public updateLoginState(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  public validateToken(token: string): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(`${this.apiUrl}/validate-token`, { token }).pipe(
      tap((response) => {
        this.updateLoginState(response.valid);
      })
    );
  }

  public login(token: string): void {
    localStorage.setItem('token', token);
    this.updateLoginState(true);
  }

  public clearToken(): void {
    localStorage.removeItem('token');
    this.updateLoginState(false);
  }
}
