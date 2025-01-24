import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { UserRole } from '@models/user';
import { SessionQuery } from '@store/session.query';
import { SessionService } from '@store/session.service';
import { catchError, map, of } from 'rxjs';

const AdminPermissions = []; // Todas

const ManagerPermissions = [
  'home',
  'client',
  'solicitation',
  'defaulter',
  'partners',
];

const ClientPermissions = ['home', 'client', 'defaulter', 'solicitation'];

const permissions = {
  admin: AdminPermissions,
  manager: ManagerPermissions,
  client: ClientPermissions,
};

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const sessionQuery = inject(SessionQuery);

  let page: string = route.data.page;

  return sessionQuery.user$.pipe(
    map((user) => {
      if (!sessionService.isAuthenticated()) router.navigate(['/login']);
      else {
        if(!user) sessionService.getUserFromBack().subscribe();
        return true;
      }

      if (user) {
        if (user?.role.toLowerCase() == UserRole.Admin.toLowerCase())
          return true;
        else if (permissions[user?.role.toLowerCase()].includes(page))
          return true;
      }

      return false;
    }),
    catchError((error) => {
      console.error('Permission check error:', error);

      if (sessionService.isAuthenticated()) router.navigate(['/painel/home']);
      else router.navigate(['/painel/login']);

      return of(false);
    })
  );
};
