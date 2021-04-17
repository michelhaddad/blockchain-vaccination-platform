import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/auth.service';
import { TableButtonEnum } from 'src/app/modules/orders/models/planning-status.enum';
import { ResponseModel } from 'src/app/shared/models/api-response.model';
import { OrganizationEnum } from 'src/app/shared/models/organization.enum';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { DonationService } from '../../donation.service';
import { DonationRowModel } from '../../models/donation-row.model';
import { DonationStateEnum } from '../../models/donation-sate.enum';
import { DonationModel } from '../../models/donation.model';
import { DonateComponent } from '../dialogs/donate/donate.component';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss'],
})
export class DonationsComponent implements OnInit {
  donations: ResponseModel<DonationModel>[] = [];
  isDonor: boolean = false;
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('donationId', 'Donation ID'),
    new TableColumnModel('donor', 'Donor'),
    new TableColumnModel('amount', 'Amount'),
    new TableColumnModel('date', 'Issue Date'),
    new TableColumnModel('button', '', false, true)
  ];

  tableDataSource: MatTableDataSource<DonationRowModel> = new MatTableDataSource();

  constructor(
    public dialog: MatDialog,
    private donationService: DonationService,
    private authService: AuthService
  ) {
    this.isDonor =
      this.authService.getOrganizationType() == OrganizationEnum.Donor;
  }

  ngOnInit(): void {
    this.getDonations();
  }

  getDonations(): void {
    if (!this.isDonor) {
      this.donationService.getAllDonations().subscribe((result) => {
        this.donations = result.response
        this.createDonations();
      });
    } else {
      this.donationService.getDonationByUser().subscribe((result) => {
        this.donations = result.response;
        this.createDonations();
      });
    }
  }

  redeemDonation(event: any) {
    this.donationService.redeemDonation(event.item.donationId).subscribe(()=>{
      this.getDonations();
    });
  }

  createDonations(): void {
    const dataSource: any[] = [];
    this.donations.forEach((e) => {
      const row = new DonationRowModel(
        e.Record.id,
        e.Record.amount,
        e.Record.issueDateTime,
        e.Record.issuer,
        !this.isDonor && e.Record.currentState == DonationStateEnum.ISSUED
          ? TableButtonEnum.REDEEM
          : TableButtonEnum.NONE
      );
      dataSource.push(row);
    });
    this.tableDataSource = new MatTableDataSource(dataSource);
  }

  donate(): void {
    const dialogRef = this.dialog.open(DonateComponent, {
      panelClass: 'donate-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getDonations();
    });
  }
}
