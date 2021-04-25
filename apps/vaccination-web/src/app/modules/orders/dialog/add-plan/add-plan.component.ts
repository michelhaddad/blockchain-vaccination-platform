import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PlanningService } from '../../planning.service';

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
    private ngxLoader: NgxUiLoaderService,
    private dialogRef: MatDialogRef<AddPlanComponent>
  ) {
    this.formGroup = new FormGroup({
      date: new FormControl(null, [Validators.required]),
      hospital: new FormControl({value:"Hospital", disabled: true},  [Validators.required]),
      storageFacility: new FormControl({value:"StorageFacility",disabled:true}, [Validators.required]),
      numberVials: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    const form = this.formGroup.getRawValue();
    if (this.formGroup.valid) {
      this.planningService.addDeliveryPlans(this.data.orderId, form.storageFacility, form.hospital, this.data.batchNumber, form.numberVials, form.date).subscribe(() => {
        this.ngxLoader.stop();
        this.dialogRef.close();
      }, () => this.dialogRef.close(true))
    }
  }
}
