import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlanningService } from '../../../planning.service';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private planningService: PlanningService,
    private dialogRef: MatDialogRef<AddPlanComponent>
  ) {
    this.formGroup = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      hospital: new FormControl(null, [Validators.required]),
      storageFacility: new FormControl(null, [Validators.required]),
      batchNumber: new FormControl(null, [Validators.required]),
      numberVials: new FormControl(null, [Validators.required]),
      arrivalDate: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    const form = this.formGroup.getRawValue();
    if (this.formGroup.valid) {
      this.planningService.addDeliveryPlans(this.data.orderId, form.storageFacility, form.hospital, form.batchNumber, form.numberVials, form.arrivalDate).subscribe(() => {
        this.dialogRef.close();
      }, () => this.dialogRef.close())
    }
  }
}
