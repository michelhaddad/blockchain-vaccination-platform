import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class APIInterceptor implements HttpInterceptor {  

    constructor(private authService: AuthService) {}  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 

      const authToken = this.authService.getToken();

      if(authToken){
        request = request.clone({
          headers: request.headers.set("Authorization","Bearer" + authToken)
        });
      }

    return next.handle(request);
  }
}