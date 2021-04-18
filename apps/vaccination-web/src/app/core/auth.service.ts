import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrganizationEnum } from '../shared/models/organization.enum';
import { SidenavSection } from '../shared/models/sidenav-section.model';
import { userAuthModules } from './app-modules-sections';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  allowedSections: SidenavSection[] = [];
  constructor() {
      this.setUpOrganization(6);
  }

//   export enum OrganizationEnum {
//     Hospital = 1,
//     BorderControl = 2,
//     MOPH = 3,
//     Impact = 4,
//     StorageFacility = 5,
//     Donor = 6,
//     Manufacturer = 7,
//     Default = 8
// }
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
}
