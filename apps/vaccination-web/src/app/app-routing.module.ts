import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/auth-gard.service';
import { LoginComponent } from './core/login/login.component';
import { MainComponent } from './core/main/main.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'networkconfiguration',
        loadChildren: () =>
          import(
            './modules/network-configuration/network-configuration.module'
          ).then((m) => m.NetworkConfigurationModule),
      },
      {
        path: 'donations',
        loadChildren: () =>
          import('./modules/donations/donations.module').then(
            (m) => m.DonationsModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/orders/orders.module').then(
            (m) => m. OrdersModule
          ),
      },
    ],
    canActivate: [AuthGuardService],
    canActivateChild:[AuthGuardService],
    runGuardsAndResolvers: 'always'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
