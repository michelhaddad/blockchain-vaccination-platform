import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/core/auth.service';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { UserRowModel } from '../../models/user-row.model';
import { AddUserComponent } from '../dialogs/add-user/add-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('username', 'User Name'),
    new TableColumnModel('role', 'Role'),
  ];
  users: any[] = [];
  tableDataSource: MatTableDataSource<UserRowModel> = new MatTableDataSource(); 

  constructor(public dialog: MatDialog, private authService: AuthService,
    private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void { 
    this.getUsers();
  }

  getUsers(): void {
    this.authService.getUsers().subscribe((res)=>{
      this.ngxLoader.stop();
      this.users=res;
      this.createUsers();
    });
  }

  createUsers(): void {
    const dataSource: any[] = [];
    this.users.forEach((e) => {
      const row = new UserRowModel(
        e.username,
        e.admin ? "Organization Admin" : "Organization User"
      );
      dataSource.push(row);
    });
    this.tableDataSource = new MatTableDataSource(dataSource);
  }

  addUser(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      panelClass: 'add-user-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => { 
      this.getUsers()
    });
  }
}
