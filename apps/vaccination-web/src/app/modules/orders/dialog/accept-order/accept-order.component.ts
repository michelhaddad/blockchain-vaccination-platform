import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    private orderService: OrderService
  ) {
    this.formGroup = new FormGroup({
      batchNumber: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.orderService.acceptOrder(this.data.orderId, this.formGroup.getRawValue().batchNumber, this.formGroup.getRawValue().date).subscribe(() => {
        this.dialogRef.close();
      }, () => this.dialogRef.close());
    }
  }
}
