import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Try sessionStorage first
   
    let token = null;
    const user = sessionStorage.getItem('auth-user');
    if (user) {
      try {
        const userObj = JSON.parse(user);
        token = userObj.accessToken;
        
      } catch (e) {
        console.log('Could not parse user object:', e);
      }
    } else {
      console.log('No user object found in sessionStorage');
    }

    // Try localStorage fallback (optional)
    if (!token) {
      token = localStorage.getItem('token');
      
    }

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
    } else {
      console.log('No token found, Authorization header not set');
    }

    return next.handle(req);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
