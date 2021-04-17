import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './components/orders/orders.component';
import { AcceptOrderComponent } from './dialog/accept-order/accept-order.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderComponent } from './dialog/order/order.component';
import { PlanningComponent } from './components/planning/planning.component';
import { AddPlanComponent } from './dialog/add-plan/add-plan.component';
import { VaccinateComponent } from '../../orders/dialog/vaccinate/vaccinate.component';


@NgModule({
  declarations: [
    OrdersComponent,
    AcceptOrderComponent,
    OrderComponent,
    PlanningComponent,
    AddPlanComponent,
    VaccinateComponent
  ],
  imports: [
    SharedModule,
    OrdersRoutingModule
  ],
  entryComponents: [
    AcceptOrderComponent,
    AddPlanComponent,
    VaccinateComponent
  ]
})
export class OrdersModule { }
