import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PeerRowModel } from 'src/app/shared/models/peer-row.model';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';

@Component({
  selector: 'app-peers',
  templateUrl: './peers.component.html',
  styleUrls: ['./peers.component.scss']
})
export class PeersComponent implements OnInit {
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('name', 'Name'),
    new TableColumnModel('smt_else', 'Something else')];

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource([
    new PeerRowModel('Duumy', 'Dummy'),
    new PeerRowModel('Duumy', 'Dummy'),
    new PeerRowModel('Duumy', 'Dummy')
  ]); //dummy data
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PeersComponent>
  ) { }

  ngOnInit(): void {
  }
}
