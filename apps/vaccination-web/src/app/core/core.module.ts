import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [SharedModule, AppRoutingModule],
  exports: [],
  providers: [],
})
export class CoreModule {} // used for all singleton services
