import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { OrganizationEnum } from "../shared/models/organization.enum";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root',
  })
  export class AuthGuardService {
    constructor(private authService: AuthService,private router: Router){}
    
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.canActivate(childRoute, state);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const token = this.authService.getToken();
      if (token) {
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    }
  }