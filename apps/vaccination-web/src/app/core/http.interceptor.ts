import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {  

    constructor(private authService: AuthService, private ngxLoader: NgxUiLoaderService) {}  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
      if(request.url.indexOf(environment.host)!=-1){
        this.ngxLoader.start();
      }

      const authToken = this.authService.getToken();

      if(authToken){
        request = request.clone({
          headers: request.headers.set("Authorization","Bearer " + authToken)
        });
      }

    return next.handle(request);
  }
}