import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-accept-order',
  templateUrl: './accept-order.component.html',
  styleUrls: ['./accept-order.component.scss']
})
export class AcceptOrderComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AcceptOrderComponent>,
    private orderService: OrderService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.formGroup = new FormGroup({
      batchNumber: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      fee: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.formGroup.valid) {
      let date= new Date(this.formGroup.getRawValue().date).toISOString().slice(0,10);
      this.orderService.acceptOrder(this.data.orderId, this.formGroup.getRawValue().batchNumber, date, this.formGroup.getRawValue().fee).subscribe(() => {
        this.ngxLoader.stop();
        this.dialogRef.close();
      }, () => this.dialogRef.close());
    }
  }
}
