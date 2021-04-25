import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent as UsersComponent } from './components/users/users.component';
import { OrganizationsComponent } from './components/organizations/organizations.component';
const routes: Routes = [
  {
    path: 'organizations',
    component: OrganizationsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkConfigurationRoutingModule { }
