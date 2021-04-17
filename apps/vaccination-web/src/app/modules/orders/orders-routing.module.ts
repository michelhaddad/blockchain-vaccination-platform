import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';
import { PlanningComponent } from './components/planning/planning.component';

const routes: Routes = [
  {
    path: 'planning',
    component: PlanningComponent
  },
  {
    path: '',
    component: OrdersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
