import { NgModule } from '@angular/core';

import { DonationsRoutingModule } from './donations-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationsComponent } from './components/donations/donations.component';
import { DonateComponent } from './components/dialogs/donate/donate.component';


@NgModule({
  declarations: [
    DonationsComponent,
    DonateComponent
  ],
  imports: [
    SharedModule,
    DonationsRoutingModule
  ],
  entryComponents: []
})
export class DonationsModule { }
