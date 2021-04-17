import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './components/orders/orders.component';
import { AcceptOrderComponent } from './dialog/accept-order/accept-order.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderComponent } from './dialog/order/order.component';


@NgModule({
  declarations: [
    OrdersComponent,
    AcceptOrderComponent,
    OrderComponent
  ],
  imports: [
    SharedModule,
    OrdersRoutingModule
  ],
  entryComponents: [
    AcceptOrderComponent
  ]
})
export class OrdersModule { }
