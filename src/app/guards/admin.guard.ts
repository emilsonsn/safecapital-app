import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '@models/user';
import { SessionQuery } from '@store/session.query';
import { filter, map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(SessionQuery).user$.pipe(
    filter((user) => user !== undefined && user !== null), take(1),
    map((user) => user.role === UserRole.Admin || router.createUrlTree(['/painel/home']))
  );
};
