import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkConfigurationRoutingModule } from './network-configuration-routing.module';
import { OrganizationsComponent } from './components/organizations/organizations.component';
import { UsersComponent } from './components/users/users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddOrganizationComponent } from './components/dialogs/add-organization/add-organization.component';
import { AddUserComponent } from './components/dialogs/add-user/add-user.component';
import { AddChannelComponent } from './components/dialogs/add-channel/add-channel.component';
import { PeersComponent } from './components/dialogs/peers/peers.component';


@NgModule({
  declarations: [
    OrganizationsComponent,
    UsersComponent,
    AddOrganizationComponent,
    AddUserComponent,
    AddChannelComponent,
    PeersComponent
  ],
  imports: [
    SharedModule,
    NetworkConfigurationRoutingModule
  ],
  entryComponents: [AddOrganizationComponent, AddUserComponent, AddChannelComponent, PeersComponent]
})
export class NetworkConfigurationModule { }
