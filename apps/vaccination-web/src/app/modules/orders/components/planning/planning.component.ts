import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/auth.service';
import { ResponseModel } from 'src/app/shared/models/api-response.model';
import { OrganizationEnum } from 'src/app/shared/models/organization.enum';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { PlanningService } from '../../planning.service';
import { PlanRowModel } from '../../models/plan-row.model';
import { PlanModel } from '../../models/plan.model';
import { PlanningStatusEnum, TableButtonEnum } from '../../models/planning-status.enum';
import { VaccinateComponent } from 'src/app/orders/dialog/vaccinate/vaccinate.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})

export class PlanningComponent implements OnInit {
  isMOPH: Boolean = false;
  radioValue: number = 6;
  isHospital: Boolean = false;
  isBorderControl: Boolean = false;
  plans: ResponseModel<PlanModel>[] = [];
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('deliveryId', 'Delivery ID'),
    new TableColumnModel('date', 'Arrival Date'),
    new TableColumnModel('storageFacility', 'Storage Facility'),
    new TableColumnModel('hospital', 'Hospital'),
    new TableColumnModel('batchNumber', 'Batch Number'),
    new TableColumnModel('vialsQuantity', 'Number of Vials', false, false, false, true),
    new TableColumnModel('status', 'Status', false),
    new TableColumnModel('button', '', false, true)
  ];

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(public dialog: MatDialog, private authService: AuthService, private planningService: PlanningService, private ngxLoader: NgxUiLoaderService) {
    this.isMOPH = this.authService.getOrganizationType() == OrganizationEnum.MOPH;
    this.isHospital = this.authService.getOrganizationType() == OrganizationEnum.Hospital;
    this.isBorderControl = this.authService.getOrganizationType()== OrganizationEnum.BorderControl;
  }

  vaccinate(): void {
    const dialogRef = this.dialog.open(VaccinateComponent, {
      panelClass: 'add-channel-dialog',
    });
  }

  createPlans(): void {
    const dataSource: any[] = [];
    this.plans.forEach((e) => {
      const row = new PlanRowModel(
        e.Record.orderID,
        e.Record.deliveryID,
        e.Record.arrivalDateTime,
        e.Record.storage,
        e.Record.hospitalID ==1 ? "Hotel Dieu" : "Rafic Hariri",
        e.Record.batchNumber,
        e.Record.numberOfVials,
        this.getStatus(e.Record.currentState),
        this.getButton(e.Record.currentState),
      );
      dataSource.push(row);
    });
    this.tableDataSource = new MatTableDataSource(dataSource);
    this.tableDataSource.filterPredicate = (o: PlanRowModel, filter: string) => {
      return o.status == filter;
    }
    this.clearFilter();
  }

  getPlans(): void {
    this.planningService.getAllDeliveryPlans().subscribe((res) => {
      this.ngxLoader.stop();
      if (this.isBorderControl) {
        this.plans = res.response;
        this.plans = this.plans.filter((e) => e.Record.currentState == PlanningStatusEnum.BORDER_CONTROL || e.Record.currentState == PlanningStatusEnum.IN_STORAGE || e.Record.currentState == PlanningStatusEnum.TO_STORAGE )
      } else {
        this.plans = res.response;
      }
      this.createPlans();
    })
  }

  clearFilter(){
    this.tableDataSource.filter = '';
    this.radioValue = 6;
  }

  ngOnInit(): void {
    this.getPlans();
  }

  handlePlan(event: any): void {
    switch (event.item.button) {
      case TableButtonEnum.SENT:
        if(event.item.status == this.getStatus(PlanningStatusEnum.BORDER_CONTROL)){
          this.planningService.sendToStorage(event.item.deliveryId).subscribe(() => {
            this.ngxLoader.stop();
            this.getPlans();
          });
        }else{
          this.planningService.sendToHospital(event.item.deliveryId).subscribe(() => {
            this.ngxLoader.stop();
            this.getPlans();
          });
        }
        break;
      case TableButtonEnum.RECEIVED:
        if(event.item.status == this.getStatus(PlanningStatusEnum.TO_HOSPITAL)){
        this.planningService.receivedInHospital(event.item.deliveryId).subscribe(() => {
          this.ngxLoader.stop();
          this.getPlans();
        });
      }else{
        this.planningService.receivedInStorage(event.item.deliveryId).subscribe(() => {
          this.ngxLoader.stop();
          this.getPlans();
        });
      }
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

  onFilter(event: any){
    if(event.value==6){
      this.tableDataSource.filter="";
    }
    this.tableDataSource.filter=this.getStatus(event.value);
  }

}
