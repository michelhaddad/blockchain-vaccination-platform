import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavSection } from 'src/app/shared/models/sidenav-section.model';
import { userAuthModules } from '../app-modules-sections';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  isSideNavExpanded = false;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  sections: any[] = [];
  constructor(private authService: AuthService) {
    this.sections=authService.getAllowedSections();
  }
}
