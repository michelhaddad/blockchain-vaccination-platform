import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationEnum } from 'src/app/shared/models/organization.enum';
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

  mapOrganizationToEnum(org: string): OrganizationEnum {
    switch(org){
      case 'Hospital':
        return OrganizationEnum.Hospital;
      case 'BorderControl':
        return OrganizationEnum.BorderControl;
      case 'MOPH':
        return OrganizationEnum.MOPH;
      case 'Donor':
        return OrganizationEnum.Donor;
      case 'Manufacturer':
        return OrganizationEnum.Manufacturer;
      case 'StorageFacility':
        return OrganizationEnum.StorageFacility;
      case 'Impact':
        return OrganizationEnum.Impact;
      default:
        return OrganizationEnum.Default;
    }
  }

  submitForm() {
    if(this.formGroup.valid){
      this.authService.login(this.formGroup.get('userName')?.value, this.formGroup.get('password')?.value).subscribe((res)=>{
        this.authService.storeOrganizationType(this.mapOrganizationToEnum(res.user.organization));
        this.authService.saveLoginResponse(res.token);
        this.authService.saveUsername(this.formGroup.get('userName')?.value);
        this.authService.saveAdminRight(res.user.admin);
        this.router.navigate(['dashboard']);   
      });
    }
  }
}
