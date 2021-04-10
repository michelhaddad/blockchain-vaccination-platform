import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DonationRowModel } from 'src/app/shared/models/donation-row.model';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { DonateComponent } from '../dialogs/donate/donate.component';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss'],
})
export class DonationsComponent implements OnInit {
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('amount', 'Amount'),
    new TableColumnModel('date', 'Date')
  ];

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource([
    new DonationRowModel('20k', '20-01-2021'),
    new DonationRowModel('200k', '20-04-2021'),
    new DonationRowModel('39k', '20-05-2021'),
    new DonationRowModel('100k', '20-01-2021'),
    new DonationRowModel('10k', '20-01-2021')

  ]); //dummy data

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  donate(): void {
    const dialogRef = this.dialog.open(DonateComponent, {
      panelClass: 'donate-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
}
