import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponseModel } from 'src/app/shared/models/login-response.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formGroup: FormGroup;
  constructor(
    private router: Router, 
    private authService: AuthService
    ) {
    this.formGroup = new FormGroup({
      userName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  submitForm() {
    if(this.formGroup.valid){
      this.authService.login(this.formGroup.get('userName')?.value, this.formGroup.get('password')?.value).subscribe((res: LoginResponseModel)=>{
        this.authService.setUpOrganization(res.organizationId);
        this.authService.saveLoginResponse(res.token);
        this.authService.saveUsername(this.formGroup.get('userName')?.value);
        this.authService.saveAdminRight(res.isAdmin);
        this.router.navigate(['dashboard']);   
      });
    }
  }
}
