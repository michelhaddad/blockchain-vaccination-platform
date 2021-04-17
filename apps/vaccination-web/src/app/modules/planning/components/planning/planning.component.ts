import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/auth.service';
import { ResponseModel } from 'src/app/shared/models/api-response.model';
import { OrganizationEnum } from 'src/app/shared/models/organization.enum';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { PlanningService } from '../../planning.service';
import { PlanRowModel } from '../models/plan-row.model';
import { PlanModel } from '../models/plan.model';
import { PlanningStatusEnum, TableButtonEnum } from '../models/planning-status.enum';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})

export class PlanningComponent implements OnInit {
  isMOPH: Boolean = false;
  plans: ResponseModel<PlanModel>[] = [];
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('deliveryId', 'Delivery ID'),
    new TableColumnModel('date', 'Arrival Date'),
    new TableColumnModel('storageFacility', 'Storage Facility'),
    new TableColumnModel('hospital', 'Hospital'),
    new TableColumnModel('batchNumber', 'Batch Number'),
    new TableColumnModel('vialsQuantity', 'Number of Vials'),
    new TableColumnModel('status', 'Status', false),
    new TableColumnModel('button', '', false, true)
  ];

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(public dialog: MatDialog, private authService: AuthService, private planningService: PlanningService) {
    this.isMOPH = this.authService.getOrganizationType() == OrganizationEnum.MOPH;
  }

  createPlans(): void {
    const dataSource: any[] = [];
    this.plans.forEach((e) => {
      const row = new PlanRowModel(
        e.Record.orderID,
        e.Record.deliveryID,
        e.Record.arrivalDateTime,
        e.Record.storage,
        "Hospital",
        e.Record.batchNumber,
        e.Record.numberOfVials,
        this.getStatus(e.Record.currentState),
        this.getButton(e.Record.currentState),
      );
      dataSource.push(row);
    });
    this.tableDataSource = new MatTableDataSource(dataSource);
  }

  getPlans(): void {
    this.planningService.getAllDeliveryPlans().subscribe((res) => {
      this.plans = res.response;
      this.createPlans();
    })
  }

  ngOnInit(): void {
    this.getPlans();
  }

  handlePlan(event: any): void {
    switch (event.item.button) {
      case PlanningStatusEnum.BORDER_CONTROL:
        this.planningService.sendToStorage(event.item.deliveryId).subscribe(() => {
          this.getPlans();
        })
        break;
      case PlanningStatusEnum.TO_HOSPITAL:
        this.planningService.receivedInHospital(event.item.deliveryId).subscribe(() => {
          this.getPlans();
        })
        break;
      case PlanningStatusEnum.IN_STORAGE:
        this.planningService.sendToHospital(event.item.deliveryId).subscribe(() => {
          this.getPlans();
        })
        break;
      case PlanningStatusEnum.TO_STORAGE:
        this.planningService.receivedInStorage(event.item.deliveryId).subscribe(() => {
          this.getPlans();
        })
        break;
      default:
        break;
    }
  }

  getButton(e: PlanningStatusEnum): number {
    switch (e) {
      case PlanningStatusEnum.BORDER_CONTROL:
        if (this.authService.getOrganizationType() == OrganizationEnum.BorderControl) {
          return TableButtonEnum.SENT;
        }
        return TableButtonEnum.NONE;
      case PlanningStatusEnum.TO_HOSPITAL:
        if (this.authService.getOrganizationType() == OrganizationEnum.Hospital) {
          return TableButtonEnum.RECEIVED;
        }
        return TableButtonEnum.NONE;
      case PlanningStatusEnum.IN_STORAGE:
        if (this.authService.getOrganizationType() == OrganizationEnum.StorageFacility) {
          return TableButtonEnum.SENT;
        }
        return TableButtonEnum.NONE;
      case PlanningStatusEnum.TO_STORAGE:
        if (this.authService.getOrganizationType() == OrganizationEnum.StorageFacility) {
          return TableButtonEnum.RECEIVED;
        }
        return TableButtonEnum.NONE;
      default:
        return TableButtonEnum.NONE;
    }
  }

  getStatus(e: PlanningStatusEnum): string {
    switch (e) {
      case PlanningStatusEnum.BORDER_CONTROL:
        return 'In Border Control';
      case PlanningStatusEnum.IN_HOSPITAL:
        return 'In Hospital';
      case PlanningStatusEnum.TO_HOSPITAL:
        return 'To Hospital';
      case PlanningStatusEnum.IN_STORAGE:
        return 'In Storage';
      case PlanningStatusEnum.TO_STORAGE:
        return 'To Storage';
    }
  }

}
