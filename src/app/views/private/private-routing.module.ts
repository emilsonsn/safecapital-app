import { CollaboratorModule } from './collaborator/collaborator.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPrivateComponent } from "@shared/layouts/layout-private/layout-private.component";
import { SessionService } from '../../store/session.service';
import { permissionGuard } from '@app/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPrivateComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [permissionGuard],
        data: {
          page: 'home'
        }
      },
      {
        path: 'requests',
        loadChildren: () => import('./requests/requests.module').then(m => m.RequestsModule),
        canActivate: [permissionGuard],
        data: {
          page: 'requests'
        }
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
        canActivate: [permissionGuard],
        data: {
          page: 'orders'
        }
      },
      {
        path: 'collaborator',
        loadChildren: () => import('./collaborator/collaborator.module').then(m => m.CollaboratorModule),
        canActivate: [permissionGuard],
        data: {
          page: 'collaborator'
        }
      },
      {
        path: 'construction',
        loadChildren: () => import('./construction/construction.module').then(m => m.ConstructionModule),
        canActivate: [permissionGuard],
        data: {
          page: 'construction'
        }
      },
      {
        path: 'provider',
        loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule),
        canActivate: [permissionGuard],
        data: {
          page: 'provider'
        }
      },
      {
        path: 'services',
        loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
        canActivate: [permissionGuard],
        data: {
          page: 'services'
        }
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule),
        canActivate: [permissionGuard],
        data: {
          page: 'tasks'
        }
      },
      {
        path: 'client',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
        canActivate: [permissionGuard],
        data: {
          page: 'client'
        }
      },
      {
        path: '**',
        redirectTo: 'home',
        canMatch: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {

  constructor(
    private readonly _sessionService: SessionService
  ) {}

}




