import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelsComponent } from './components/channels/channels.component';
import { OrganizationsComponent } from './components/organizations/organizations.component';
const routes: Routes = [
  {
    path: 'organizations',
    component: OrganizationsComponent
  },
  {
    path: 'channels',
    component: ChannelsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetworkConfigurationRoutingModule { }
