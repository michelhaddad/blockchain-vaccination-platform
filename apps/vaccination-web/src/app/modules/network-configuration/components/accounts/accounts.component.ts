import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { AddUserComponent } from '../dialogs/add-user/add-user.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('name', 'Name'),
    new TableColumnModel('description', 'Description'),
  ];
  tableDataSource: MatTableDataSource<any> = new MatTableDataSource(); 

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  getUsers(): void {}

  addUser(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      panelClass: 'add-user-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => { 
      this.getUsers()
    });
  }
}
