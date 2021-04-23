import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrganizationEnum } from '../shared/models/organization.enum';
import { SidenavSection } from '../shared/models/sidenav-section.model';
import { userAuthModules } from './app-modules-sections';
import { LoginComponent } from './login/login.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  allowedSections: SidenavSection[] = [];
  isAdmin: boolean = false;
  constructor(private http: HttpClient) {}

  setAllowedSections(org: OrganizationEnum) {
    const sections = userAuthModules.allSidenavSection as SidenavSection[];
    sections.forEach((e) => {
      if(!e.hasSubSections){
        if(e.organizations.includes(org)){
         this.allowedSections.push(e);
        }
      }else {
        e.subSections=e.subSections?.filter(a=>a.organizations.includes(org));
        if(e.subSections && e.subSections.length>0){
          this.allowedSections.push(e);
        }
      }
    });
  }

  saveAdminRight(isAdmin: boolean): void {
    this.isAdmin = isAdmin;
  }

  saveLoginResponse(token: string): void {
    if(token) {
      localStorage.setItem("token", token);
    }
  }

  getToken(): string | null {
      return localStorage.getItem("token");
  }

  setUpOrganization(org: number) :void {
    this.setAllowedSections(org);
    this.storeOrganizationType(org);
  }

  getAllowedSections(): SidenavSection[]{
      return this.allowedSections;
  }

  storeOrganizationType(org: OrganizationEnum) {
    localStorage.setItem('orgType', org.toString());
  }

  getOrganizationType(): OrganizationEnum {
    const org = localStorage.getItem('orgType');
    if (org) {
      return parseInt(org);
    }
    return OrganizationEnum.Default;
  }

  login(userName: string, pass: string):  Observable<any> {
    const url = environment.host + "user/login";
    const body = {
      userName: userName,
      password: pass
    }
    return this.http.post<any>(url,body)
  }


  signup(userName: string, pass: string):  Observable<LoginComponent> {
    const url = environment.host + "user/signup";
    const body = {
      userName: userName,
      password: pass
    }
    return this.http.post<any>(url,body)
  }
}
