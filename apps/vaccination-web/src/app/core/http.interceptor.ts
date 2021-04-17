import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class APIInterceptor implements HttpInterceptor {  
    constructor() {}  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {   
    return next.handle(request);
  }
}