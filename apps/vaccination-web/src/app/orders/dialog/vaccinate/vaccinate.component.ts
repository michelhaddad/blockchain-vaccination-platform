import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from '../../../modules/orders/order.service';
import { PlanningService } from '../../../modules/orders/planning.service';

@Component({
  selector: 'app-vaccinate',
  templateUrl: './vaccinate.component.html',
  styleUrls: ['./vaccinate.component.scss']
})
export class VaccinateComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VaccinateComponent>,
    private planningService: PlanningService
  ) {
    this.formGroup = new FormGroup({
      batchNumber: new FormControl(null, [Validators.required]),
      // date: new FormControl(null, [Validators.required]),
      count: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.planningService.vaccinate(this.formGroup.getRawValue().batchNumber, this.formGroup.getRawValue().count).subscribe(() => {
        this.dialogRef.close();
      }, () => this.dialogRef.close());
    }
  }
}