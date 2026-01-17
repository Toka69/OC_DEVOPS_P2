// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.authService.updateLoginState(false);
      this.authService.clearToken();
      this.router.navigate(['/login']);

      return of(false);
    }

    return of(true);
  }
}
