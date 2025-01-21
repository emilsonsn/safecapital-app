import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, ActivatedRouteSnapshot, Route } from '@angular/router';
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

const ClientPermissions = [
  'home',
  'client',
  'defaulter',
  'solicitation',
];

const permissions = {
  admin: AdminPermissions,
  manager: ManagerPermissions,
  client: ClientPermissions,
}

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const sessionQuery = inject(SessionQuery);

  let page : string = route.data.page;

  return sessionQuery.user$.pipe(
    map(user => {
      if(!user) {
        router.navigate(['/login']);
      }
      else {
        if(user?.role.toLowerCase() == UserRole.Admin.toLowerCase()) return true;
        else if (permissions[user?.role.toLowerCase()].includes(page)) return true;
      }
      return false;
    }),
    catchError(error => {
      console.error('Permission check error:', error);
      router.navigate(['/painel/home']);
      return of(false);
    })
  );


};
