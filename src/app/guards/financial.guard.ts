import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '@models/user';
import { SessionService } from '@store/session.service';
import { map, take } from 'rxjs';

export const financialGuard: CanActivateFn = () => {
  const router = inject(Router);
  const sessionService = inject(SessionService);

  return sessionService.getUser().pipe(
    take(1),
    map(
      (user) =>
        [UserRole.Admin, UserRole.Manager].includes(user.role) ||
        router.createUrlTree(['/painel/home']),
    ),
  );
};
