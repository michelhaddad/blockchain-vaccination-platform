import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/auth.service';
import { DonationRowModel } from 'src/app/shared/models/donation-row.model';
import { DonationStateEnum } from 'src/app/shared/models/donation-sate.enum';
import { DonationModel } from 'src/app/shared/models/donations.model';
import { OrganizationEnum } from 'src/app/shared/models/organization.enum';
import { TableButtonEnum } from 'src/app/shared/models/planning-status.enum';
import { TableColumnModel } from 'src/app/shared/models/table-column.model';
import { DonationService } from '../../donation.service';
import { DonateComponent } from '../dialogs/donate/donate.component';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss'],
})
export class DonationsComponent implements OnInit {
  donations: DonationModel[] = [];
  isDonor: boolean = false;
  displayedColumns: TableColumnModel[] = [
    new TableColumnModel('donationId', 'ID'),
    new TableColumnModel('donor', 'Donor'),
    new TableColumnModel('amount', 'Amount'),
    new TableColumnModel('date', 'Issue Date'),
    new TableColumnModel('button', '', false, false, true)
  ];

  tableDataSource: MatTableDataSource<any> = new MatTableDataSource();

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
        this.donations = result.response.records;
        this.createDonations();
      });
    } else {
      this.donationService.getDonationByUser().subscribe((result) => {
        this.donations = result.response.records;
        this.createDonations();
      });
    }
  }

  redeemDonation(event: DonationRowModel) {
    this.donationService.redeemDonation(event.donationId);
  }

  createDonations(): void {
    const dataSource: any[] = [];
    this.donations.forEach((e) => {
      const row = new DonationRowModel(
        e.id,
        e.amount,
        e.issueDateTime,
        e.issuer,
        !this.isDonor && e.currentState == DonationStateEnum.ISSUED
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
