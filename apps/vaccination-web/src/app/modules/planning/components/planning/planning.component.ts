import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PlanRowModel } from 'src/app/shared/models/plan-row.model';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { AddPlanComponent } from '../dialogs/add-plan/add-plan.component';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})

export class PlanningComponent implements OnInit {
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('orderId', 'Order ID'),
    new TableColumnModel('date', 'Arrival Date'),
    new TableColumnModel('storageFacility', 'Storage Facility'),
    new TableColumnModel('hospital', 'Hospital'),
    new TableColumnModel('batchNumber', 'Batch Number'),
    new TableColumnModel('vialQuantity', 'Number of Vials'),
    new TableColumnModel('status', 'Status', false, true),
    new TableColumnModel('button', '', false, false, true)
  ];

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource([
    new PlanRowModel('11/11/2021', '1', 'RHA', 'Dummy H', '122345', 10, 1, 1),
    new PlanRowModel('11/12/2021', '2', 'RHA', 'Dummy H', '122345', 10, 2, 2),
    new PlanRowModel('11/01/2022', '3', 'RHA', 'Dummy H', '122345', 10, 3, 2)
  ]); //dummy data

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  addPlan(): void {
    const dialogRef = this.dialog.open(AddPlanComponent, {
      panelClass: 'add-plan-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

}
