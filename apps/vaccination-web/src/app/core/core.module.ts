import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { APIInterceptor } from './http.interceptor';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [SharedModule, AppRoutingModule],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {} // used for all singleton services
