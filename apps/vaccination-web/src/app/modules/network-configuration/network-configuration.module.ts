import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkConfigurationRoutingModule } from './network-configuration-routing.module';
import { OrganizationsComponent } from './components/organizations/organizations.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddOrganizationComponent } from './components/dialogs/add-organization/add-organization.component';
import { AddPeerComponent } from './components/dialogs/add-peer/add-peer.component';
import { AddChannelComponent } from './components/dialogs/add-channel/add-channel.component';
import { PeersComponent } from './components/dialogs/peers/peers.component';


@NgModule({
  declarations: [
    OrganizationsComponent,
    ChannelsComponent,
    AddOrganizationComponent,
    AddPeerComponent,
    AddChannelComponent,
    PeersComponent
  ],
  imports: [
    SharedModule,
    NetworkConfigurationRoutingModule
  ],
  entryComponents: [AddOrganizationComponent, AddPeerComponent, AddChannelComponent, PeersComponent]
})
export class NetworkConfigurationModule { }
