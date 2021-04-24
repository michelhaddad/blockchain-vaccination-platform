import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private http: HttpClient, private router: Router) {}

  getAllowedSections() {
    this.allowedSections = [];
    const sections = userAuthModules.allSidenavSection as SidenavSection[];
    const isAdmin = this.getAdminRight();
    const org = isAdmin ? OrganizationEnum.Admin : this.getOrganizationType();
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
    return this.allowedSections
  }

  saveAdminRight(isAdmin: boolean): void {
    localStorage.setItem("admin", isAdmin.toString());
  }

  getAdminRight(): boolean {
    const isAdmin = localStorage.getItem("admin") == "true" ? true : false;
    return isAdmin;
  }

  saveLoginResponse(token: string): void {
    if(token) {
      localStorage.setItem("token", token);
    }
  }

  saveUsername(user: string): void {
    if(user) {
      localStorage.setItem("userName", user);
    }
  }

  getToken(): string | null {
      return localStorage.getItem("token");
  }
  
  getUserName(): string | null {
      return localStorage.getItem("userName");
  }

  clearStorage(): void {
     localStorage.removeItem("token");
     localStorage.removeItem("orgType");
     localStorage.removeItem("userName");
     localStorage.removeItem("admin");
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
      username: userName,
      password: pass
    }
    return this.http.post<any>(url,body)
  }

  logout(){
    this.clearStorage();
    this.router.navigate(['login']);
  }

  signup(userName: string, pass: string):  Observable<LoginComponent> {
    const url = environment.host + "user/signup";
    const body = {
      username: userName,
      password: pass
    }
    return this.http.post<any>(url,body)
  }

  getUsers(){
    const url = environment.host + "users";
    return this.http.get<any>(url)
  }
}
