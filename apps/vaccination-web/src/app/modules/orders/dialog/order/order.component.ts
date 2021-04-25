import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrderService } from '../../order.service';
;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
    formGroup: FormGroup;
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<OrderComponent>,
      private orderState: OrderService,
      private ngxLoader: NgxUiLoaderService
    ) {
      this.formGroup = new FormGroup({
        date: new FormControl(null, [Validators.required]),
        numberVials: new FormControl(null, [Validators.required])
      });
    }
  
    ngOnInit(): void { }
  
    cancelClick(): void {
      this.dialogRef.close();
    }
  
    submitForm() {
      if(this.formGroup.valid){
        let date= new Date(this.formGroup.getRawValue().date).toISOString().slice(0,10);
        this.orderState.order(this.formGroup.getRawValue().numberVials, date).subscribe(()=>{
          this.ngxLoader.stop();
          this.dialogRef.close();
        })
      }
    }
  }
  