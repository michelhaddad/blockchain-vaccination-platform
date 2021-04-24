import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './components/accounts/accounts.component';
import { OrganizationsComponent } from './components/organizations/organizations.component';
const routes: Routes = [
  {
    path: 'organizations',
    component: OrganizationsComponent
  },
  {
    path: 'accounts',
    component: AccountsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkConfigurationRoutingModule { }
