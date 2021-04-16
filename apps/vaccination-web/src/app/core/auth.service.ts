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
      this.setUpOrganization(3);
  }

  setAllowedSections(org: OrganizationEnum) {
    const sections = userAuthModules.allSidenavSection as SidenavSection[];
    this.allowedSections = sections.filter((e) => e.organizations.includes(org));
  }

  setUpOrganization(org: number) :void {
    this.setAllowedSections(org);
    this.storeOrganizationType(org);
  }

  getAllowedSections(): SidenavSection[]{
      console.log(this.allowedSections);
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
