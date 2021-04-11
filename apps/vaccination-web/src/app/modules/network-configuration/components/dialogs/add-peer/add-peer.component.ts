import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-peer',
  templateUrl: './add-peer.component.html',
  styleUrls: ['./add-peer.component.scss']
})
export class AddPeerComponent implements OnInit {
  formGroup: FormGroup;
  organizations: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddPeerComponent>
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    this.dialogRef.close();
  }
}
