import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OrganizationRowModel } from 'src/app/shared/models/organization-row.model';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { AddPeerComponent } from '../dialogs/add-peer/add-peer.component';
import { PeersComponent } from '../dialogs/peers/peers.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss'],
})
export class OrganizationsComponent implements OnInit {
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('name', 'Name', true),
    new TableColumnModel('description', 'Description'),
    new TableColumnModel('button', '', false),
  ];

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource([
    new OrganizationRowModel('Impact', 'Describing impact'),
    new OrganizationRowModel('Donor', 'Describing donor'),
    new OrganizationRowModel('MoPH', 'Describing MoPH'),
    new OrganizationRowModel('Manufacturer', 'Describing manuf'),
    new OrganizationRowModel('Hospital', 'Describing Hospitals'),
    new OrganizationRowModel('Border Control', 'Describing Border Control'),
    new OrganizationRowModel('Storage Facility', 'Describing SF'),
  ]); //dummy data

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  // addOrganization(): void {
  //   const dialogRef = this.dialog.open(AddOrganizationComponent, {
  //     panelClass: 'add-organization-dialog',
  //   });
  //   dialogRef.afterClosed().subscribe((result) => { });
  // }

  // addPeer(event: any): void {
  //   const dialogRef = this.dialog.open(AddPeerComponent, { panelClass: 'add-peer-dialog', data: event.element });
  //   dialogRef.afterClosed().subscribe(result => { });
  // }

  showPeers(event: any): void {
    const dialogRef = this.dialog.open(PeersComponent, { panelClass: 'peers-dialog', data: event.item });
    dialogRef.afterClosed().subscribe(result => { });
  }
}
