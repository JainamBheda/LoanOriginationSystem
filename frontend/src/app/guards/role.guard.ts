import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const role = authService.getRole();

  if (role && allowedRoles.includes(role)) {
    return true;
  }

  router.navigate([role === 'CUSTOMER' ? '/loan-apply' : '/dashboard']);
  return false;
};
