import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  formGroup: FormGroup;
  organizations: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private authService: AuthService
  ) {
    this.formGroup = new FormGroup({
      userName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void { }

  cancelClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.authService.login(this.formGroup.get('userName')?.value,
      this.formGroup.get('password')?.value).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}
