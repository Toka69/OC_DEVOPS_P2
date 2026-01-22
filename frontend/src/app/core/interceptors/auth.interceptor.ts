import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Observable, switchMap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/api/')) {
      const token = localStorage.getItem('token');

      if (token) {
        const authReq = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });

        return next.handle(authReq).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              return this.handle401Error(authReq, next);
            }

            return throwError(error);
          })
        );
      }
    }

    return next.handle(request);
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);

      return throwError('Token not found');
    }

    return this.authService.validateToken(token).pipe(
      switchMap((response) => {
        if (response.valid) {
          return next.handle(request);
        } else {
          this.router.navigate(['/login']);

          return throwError('Invalid token');
        }
      }),
      catchError((error) => {
        this.router.navigate(['/login']);

        return throwError(error);
      })
    );
  }
}

