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
import { TableButtonEnum } from 'src/app/modules/planning/components/models/planning-status.enum';
import { AddPlanComponent } from 'src/app/modules/planning/components/dialogs/add-plan/add-plan.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  orders: ResponseModel<OrderModel>[] = [];
  isMOPH: boolean = false;
  isBorderControl: boolean = false;

  displayedColumns: TableColumnModel[] = [];

  tableDataSource: MatTableDataSource<OrderRowModel> = new MatTableDataSource();

  constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isMOPH =
      this.authService.getOrganizationType() == OrganizationEnum.MOPH;
    this.isBorderControl = this.authService.getOrganizationType() == OrganizationEnum.BorderControl;
  }

  ngOnInit(): void {
    this.setDisplayedColumns();
    this.getOrders();
  }

  setDisplayedColumns() {
    this.displayedColumns = [
      new TableColumnModel('orderId', 'Order ID', this.isMOPH),
      new TableColumnModel('issueDate', 'Order Date'),
      new TableColumnModel('issuer', 'Ordered By'),
      new TableColumnModel('requestedArrivalDate', 'Requested Arrival Date'),
      new TableColumnModel('expectedArrivalDate', 'Arrival Date'),
      new TableColumnModel('vialsAmount', 'Number of Vials'),
      new TableColumnModel('status', 'Status'),
      new TableColumnModel('batchNumber', 'Batch Number'),
    ]
    if (this.isMOPH) {
      this.displayedColumns.push(new TableColumnModel('manufacturer', 'Manufacturer'));
      this.displayedColumns.push(new TableColumnModel('button', '', false, true));
    } else if (this.isBorderControl) {
      this.displayedColumns.push(new TableColumnModel('button', '', false, true));
    }
    else {
      this.displayedColumns.push(new TableColumnModel('menu', '', false, true, true, [new MenuItemModel("Accept", TableButtonEnum.ACCEPT), new MenuItemModel("Reject", TableButtonEnum.REJECT)]));
    }
  }

  addDelivery(event: any): void {
    const dialogRef = this.dialog.open(AddPlanComponent, {
      panelClass: 'add-plan-dialog',
      data: { orderId: event.item.orderId }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['planning']);
    });
  }

  handleOrder(e: any) {
    switch (e.action) {
      case TableButtonEnum.ACCEPT:
        const dialogRef = this.dialog.open(AcceptOrderComponent, { data: e.item });
        dialogRef.afterClosed().subscribe(result => { });

        break;
      case TableButtonEnum.REJECT:
        this.orderService.rejectOrder(e.item.orderId).subscribe(() => {
          this.getOrders();
        })
        break;
    }

  }

  getStatus(e: OrderStateEnum): string {
    switch (e) {
      case OrderStateEnum.REJECTED:
        return 'Rejected';
      case OrderStateEnum.REQUESTED:
        return 'Pending Approval';
      case OrderStateEnum.DELIVERED:
        return 'Delivered';
      case OrderStateEnum.SHIPPED:
        return 'Shipped';
      case OrderStateEnum.APPROVED:
        return 'Approved';
    }
  }

  getOrders(): void {
    this.orderService.getAllOrders().subscribe((result) => {
      if (this.isBorderControl) {
        this.orders = result.response;
        this.orders.filter((e) => e.Record.currentState == OrderStateEnum.APPROVED || e.Record.currentState == OrderStateEnum.SHIPPED || e.Record.currentState == OrderStateEnum.DELIVERED)
      } else {
        this.orders = result.response;
      }
      this.createOrders();
    });
  }

  shipOrder(event: any): void {
    switch(event.item.button){
      case TableButtonEnum.SHIP:
        this.orderService.shipOrder(event.item.orderId).subscribe(() => {
          this.getOrders();
        });
        break;
      case TableButtonEnum.RECEIVED:
        this.orderService.setOrderDelivered(event.item.orderId).subscribe(() => {
          this.getOrders();
        });
        break;
    }
  }

  createOrders(): void {
    const dataSource: any[] = [];
    this.orders.forEach((e) => {
      const row = new OrderRowModel(
        e.Record.id,
        e.Record.issueDateTime,
        e.Record.issuer,
        e.Record.requestedArrivalDate,
        e.Record.expectedDeliveryDate ? e.Record.expectedDeliveryDate : "No Delivery Date",
        e.Record.batchNumber ? e.Record.batchNumber : "No Batch Number",
        e.Record.vialsAmount,
        this.getStatus(e.Record.currentState),
        e.Record.manufacturer,
        !this.isMOPH && !this.isBorderControl && e.Record.currentState == OrderStateEnum.REQUESTED ? TableButtonEnum.ACCEPT : 
        (this.isBorderControl && e.Record.currentState==OrderStateEnum.SHIPPED ? TableButtonEnum.RECEIVED : TableButtonEnum.NONE),
        e.Record.currentState == OrderStateEnum.APPROVED ? TableButtonEnum.SHIP : TableButtonEnum.NONE
      );
      dataSource.push(row);
    });
    this.tableDataSource = new MatTableDataSource(dataSource);
  }

  order() {
    const dialogRef = this.dialog.open(OrderComponent);
    dialogRef.afterClosed().subscribe(result => { });

  }
}
