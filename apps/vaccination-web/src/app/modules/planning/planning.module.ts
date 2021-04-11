import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanningRoutingModule } from './planning-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanningComponent } from './components/planning/planning.component';
import { AddPlanComponent } from './components/dialogs/add-plan/add-plan.component';


@NgModule({
  declarations: [
    PlanningComponent,
    AddPlanComponent
  ],
  imports: [
    PlanningRoutingModule,
    SharedModule
  ],
  entryComponents: [AddPlanComponent]
})
export class PlanningModule { }
