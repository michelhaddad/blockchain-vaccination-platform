import { } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [SharedModule, DashboardRoutingModule, NgxChartsModule],
  exports: [],
  providers: [],
})
export class DashboardModule { }