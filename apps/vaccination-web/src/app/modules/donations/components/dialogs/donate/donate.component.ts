import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DonationService } from '../../../donation.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})

export class DonateComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DonateComponent>,
    private ngxLoader: NgxUiLoaderService,
    private donationService: DonationService
  ) {
    this.formGroup = new FormGroup({
      amount: new FormControl(null, [Validators.required, Validators.min(0)])
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() : void{
    const amount: number = this.formGroup.get('amount')?.value;
    if(amount){
      this.donationService.donate(amount).subscribe(e=>{
        this.ngxLoader.stop();
        this.dialogRef.close();
      },err=>{
        this.dialogRef.close();
      })
    }
  }
}
