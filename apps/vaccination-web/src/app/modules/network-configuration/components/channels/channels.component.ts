import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddChannelComponent } from 'src/app/modules/network-configuration/components/dialogs/add-channel/add-channel.component';
import { ChannelRowModel } from 'src/app/shared/models/channel-row.model';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})
export class ChannelsComponent implements OnInit {
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('name', 'Name'),
    new TableColumnModel('description', 'Description'),
  ];

  // tableDataSource: MatTableDataSource<any> = new MatTableDataSource([
  // ]); //dummy data

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  addChannel(): void {
    const dialogRef = this.dialog.open(AddChannelComponent, {
      panelClass: 'add-channel-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }
}
