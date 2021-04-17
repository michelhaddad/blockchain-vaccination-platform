import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/auth.service';
import { ResponseModel } from 'src/app/shared/models/api-response.model';
import { MenuItemModel } from 'src/app/shared/models/menu-item.model';
import { OrderRowModel } from 'src/app/shared/models/order-row.model';
import { OrderModel, OrderStateEnum } from 'src/app/shared/models/order.model';
import { OrganizationEnum } from 'src/app/shared/models/organization.enum';
import { TableButtonEnum } from 'src/app/shared/models/planning-status.enum';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { AcceptOrderComponent } from '../../dialog/accept-order/accept-order.component';
import { OrderComponent } from '../../dialog/order/order.component';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  orders: ResponseModel<OrderModel>[] = [];
  isMOPH: boolean = false;

  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('orderId', 'Order ID'),
    new TableColumnModel('issueDate', 'Order Date'),
    new TableColumnModel('issuer', 'Ordered By'),
    new TableColumnModel('requestedArrivalDate', 'Requested Arrival Date'),
    new TableColumnModel('expectedArrivalDate', 'Arrival Date'),
    new TableColumnModel('vialsAmount', 'Number of Vials'),
    new TableColumnModel('status','Status'),
    new TableColumnModel('batchNumber','Batch Number'),
  ];

  tableDataSource: MatTableDataSource<OrderRowModel> = new MatTableDataSource();

  constructor(
    public dialog: MatDialog,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.isMOPH =
      this.authService.getOrganizationType() == OrganizationEnum.MOPH;
  }

  ngOnInit(): void {
    this.getOrders();
  }

  setDisplayedColumns(){
    if(this.isMOPH){
      this.displayedColumns.push(new TableColumnModel('manufacturer', 'Manufacturer'));
      this.displayedColumns.push( new TableColumnModel('button','', false, true ));
    }else{
      this.displayedColumns.push(new TableColumnModel('menu', '', false, true, true, [new MenuItemModel("Accept",TableButtonEnum.ACCEPT),  new MenuItemModel("Reject",TableButtonEnum.REJECT)]));
    }
  }

  handleOrder(e: any){
    switch(e.action){
      case TableButtonEnum.ACCEPT:
        const dialogRef = this.dialog.open(AcceptOrderComponent, {  data: e.item });
        dialogRef.afterClosed().subscribe(result => { });

        break;
      case TableButtonEnum.REJECT:
        this.orderService.rejectOrder(e.item.orderId).subscribe(()=>{
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
        this.orders = result.response;
        this.createOrders();
      });
  }
  shipOrder(event: any) : void {
    this.orderService.shipOrder(event.item.donationId).subscribe(()=>{
      this.getOrders();
    });
  }

  createOrders(): void {
    const dataSource: any[] = [];
    this.orders.forEach((e) => {
      const row = new OrderRowModel(
        e.Record.id,
        e.Record.issueDateTime,
        e.Record.issuer,
        e.Record.requestedArrivalDate,
        e.Record.expectedDeliveryDate ? e.Record.expectedDeliveryDate :"No Delivery Date",
        e.Record.batchNumber? e.Record.batchNumber : "No Batch Number" ,
        e.Record.vialsAmount,
        this.getStatus(e.Record.currentState),
        e.Record.manufacturer,
        !this.isMOPH &&  e.Record.currentState==OrderStateEnum.REQUESTED ? TableButtonEnum.ACCEPT : TableButtonEnum.NONE,
        e.Record.currentState ==OrderStateEnum.APPROVED ? TableButtonEnum.SHIP : TableButtonEnum.NONE
      );
      dataSource.push(row);
    });
    this.tableDataSource = new MatTableDataSource(dataSource);
  }

  order(){
    const dialogRef = this.dialog.open(OrderComponent);
    dialogRef.afterClosed().subscribe(result => { });
    
  }
}
