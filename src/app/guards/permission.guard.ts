import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, ActivatedRouteSnapshot, Route } from '@angular/router';
import { SessionQuery } from '@store/session.query';
import { SessionService } from '@store/session.service';
import { catchError, map, of } from 'rxjs';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const sessionQuery = inject(SessionQuery);

  let page : string = route.data.page;
  let hasPermission = true;

  return sessionQuery.user$.pipe(
    map(user => {

      // if(!user) {
      //   router.navigate(['/login']);
      //   hasPermission = false;
      // }
      // else {

      //   const notAllowedPermissionToRequester = [
      //     'home',
      //     'collaborator',
      //     'construction',
      //     'provider',
      //     'services',
      //     'tasks',
      //     'client'
      //   ];

      //   if (user?.company_position?.position == 'Requester' && notAllowedPermissionToRequester.includes(page))
      //     hasPermission = false;

      // }
      return true;

      return hasPermission;
    }),
    catchError(error => {
      console.error('Permission check error:', error);
      router.navigate(['/painel/home']);
      return of(false);
    })
  );


};
