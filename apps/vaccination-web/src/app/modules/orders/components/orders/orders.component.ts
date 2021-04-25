import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/auth.service';
import { ResponseModel } from 'src/app/shared/models/api-response.model';
import { MenuItemModel } from 'src/app/shared/models/menu-item.model';
import { OrderRowModel } from 'src/app/modules/orders/models/order-row.model';
import { OrderModel, OrderStateEnum } from 'src/app/modules/orders/models/order.model';
import { OrganizationEnum } from 'src/app/shared/models/organization.enum';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { AcceptOrderComponent } from '../../dialog/accept-order/accept-order.component';
import { OrderComponent } from '../../dialog/order/order.component';
import { OrderService } from '../../order.service';
import { AddPlanComponent } from 'src/app/modules/orders/dialog/add-plan/add-plan.component';
import { Router } from '@angular/router';
import { TableButtonEnum } from '../../models/planning-status.enum';
import { DonationService } from 'src/app/modules/donations/donation.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  orders: ResponseModel<OrderModel>[] = [];
  isMOPH: boolean = false;
  isBorderControl: boolean = false;
  radioValue: number = 5;
  funds: number = 0;
  displayedColumns: TableColumnModel[] = [];

  tableDataSource: MatTableDataSource<OrderRowModel> = new MatTableDataSource();

  constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private donationService: DonationService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.isMOPH =
      this.authService.getOrganizationType() == OrganizationEnum.MOPH;
    this.isBorderControl = this.authService.getOrganizationType() == OrganizationEnum.BorderControl;
  }

  ngOnInit(): void {
    this.setDisplayedColumns();
    this.getData();
    
  }

  getData(){
    this.getOrders();
    this.getFunds();
  }

  getFunds(){
    if(this.isMOPH){
      this.donationService.getFunds().subscribe((e)=>{
        this.ngxLoader.stop();
        this.funds=e.response.redeemedAmount - e.response.payedAmount;
      })
    }
  }

  setDisplayedColumns() {
    this.displayedColumns = [
      new TableColumnModel('orderId', 'Order ID'),
      new TableColumnModel('issueDate', 'Order Date'),
      new TableColumnModel('issuer', 'Ordered By'),
      new TableColumnModel('batchNumber', 'Batch Number'),
      new TableColumnModel('vialsAmount', 'Number of Vials'),
      new TableColumnModel('price', 'Price'),
      new TableColumnModel('requestedArrivalDate', 'Requested Arrival Date'),
      new TableColumnModel('expectedArrivalDate', 'Arrival Date'),
      new TableColumnModel('status', 'Status',false,false,false,false,false,true),
    ]
    if (this.isMOPH) {
      // this.displayedColumns.push(new TableColumnModel('manufacturer', 'Manufacturer'));
      this.displayedColumns.push(new TableColumnModel('menu', '', false, true, true));
    } else if (this.isBorderControl) {
      this.displayedColumns.push(new TableColumnModel('button', '', false, true));
    }
    else {
      this.displayedColumns.push(new TableColumnModel('menu', '', false, true, true));
    }
  }

  addDelivery(event: any): void {
    const dialogRef = this.dialog.open(AddPlanComponent, {
      panelClass: 'add-plan-dialog',
      data: { orderId: event.item.orderId, batchNumber: event.item.batchNumber }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['planning']);
      }
    });
  }

  handleOrder(e: any) {
    switch (e.action) {
      case TableButtonEnum.ACCEPT:
        const dialogRef = this.dialog.open(AcceptOrderComponent, { data: e.item });
        dialogRef.afterClosed().subscribe(result => { this.getData() });

        break;
      case TableButtonEnum.REJECT:
        this.orderService.rejectOrder(e.item.orderId).subscribe(() => {
          this.ngxLoader.stop();
          this.getData();
        })
        break;
      case TableButtonEnum.SHIP:
        this.orderService.shipOrder(e.item.orderId).subscribe(() => {
          this.ngxLoader.stop();
          this.getData();
        });
        break;
      case TableButtonEnum.ADD_PLAN:
        this.addDelivery(e);
        break;
    }

  }

  getStatus(e: OrderStateEnum): string {
    switch (e) {
      case OrderStateEnum.REJECTED:
        return 'Rejected';
      case OrderStateEnum.REQUESTED:
        return 'Pending';
      case OrderStateEnum.DELIVERED:
        return 'Delivered';
      case OrderStateEnum.SHIPPED:
        return 'Shipped';
      case OrderStateEnum.APPROVED:
        return 'Accepted';
    }
  }

  onFilter(event: any) {
    this.radioValue = event.value;
    if (event.value == 5) {
      this.tableDataSource.filter = "";
    }
    this.tableDataSource.filter = this.getStatus(event.value);
  }

  clearFilter(){
    this.tableDataSource.filter = '';
    this.radioValue = 5;
  }

  getOrders(): void {
    this.orderService.getAllOrders().subscribe((result) => {
      this.ngxLoader.stop();
      if (this.isBorderControl) {
        this.orders = result.response;
        this.orders = this.orders.filter((e) => e.Record.currentState == OrderStateEnum.APPROVED || e.Record.currentState == OrderStateEnum.SHIPPED || e.Record.currentState == OrderStateEnum.DELIVERED)
      } else {
        this.orders = result.response;
      }
      this.createOrders();
    });
  }

  receiveOrder(event: any): void {
    switch (event.item.button) {
      case TableButtonEnum.RECEIVED:
        this.orderService.setOrderDelivered(event.item.orderId).subscribe(() => {
          this.ngxLoader.stop();
          this.getData();
        });
        break;
    }
  }

  createOrders(): void {
    const menuItemsPlan: MenuItemModel[] = [new MenuItemModel("Add Delivery Plan", TableButtonEnum.ADD_PLAN)]
    const menuItems: MenuItemModel[] = [new MenuItemModel("Accept", TableButtonEnum.ACCEPT), new MenuItemModel("Reject", TableButtonEnum.REJECT)];
    const menuItemsShip: MenuItemModel[] = [new MenuItemModel("Ship", TableButtonEnum.SHIP)]
    const dataSource: any[] = [];
    this.orders.forEach((e) => {
      const row = new OrderRowModel(
        e.Record.id,
        e.Record.issueDateTime,
        e.Record.issuer,
        e.Record.requestedArrivalDate,
        e.Record.expectedDeliveryDate ? e.Record.expectedDeliveryDate : " Not Available",
        e.Record.batchNumber ? e.Record.batchNumber : "Not Available",
        e.Record.vialsAmount,
        e.Record.fee ? e.Record.fee.toString() : "Not Available",
        this.getStatus(e.Record.currentState),
        e.Record.manufacturer,
        !this.isMOPH && !this.isBorderControl ? (e.Record.currentState == OrderStateEnum.REQUESTED ? menuItems : (e.Record.currentState == OrderStateEnum.APPROVED ? menuItemsShip : [])) : (this.isMOPH && e.Record.currentState == OrderStateEnum.DELIVERED ? menuItemsPlan : []),
        this.isBorderControl && e.Record.currentState == OrderStateEnum.SHIPPED ? TableButtonEnum.RECEIVED : TableButtonEnum.NONE
      );
      dataSource.push(row);
    });
    this.tableDataSource = new MatTableDataSource(dataSource);
    this.clearFilter();
    this.tableDataSource.filterPredicate = (o: OrderRowModel, filter: string) => {
      return o.status == filter;
    }
  }

  order() {
    const dialogRef = this.dialog.open(OrderComponent);
    dialogRef.afterClosed().subscribe(result => { this.getData(); });

  }
}
