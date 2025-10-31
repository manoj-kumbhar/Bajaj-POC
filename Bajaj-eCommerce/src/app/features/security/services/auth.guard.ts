import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  const returnUrl = state.url && state.url !== '/' ? state.url : '/home';
  router.navigate(['/login'], { queryParams: { returnurl: returnUrl } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role === 'admin') {
    return true;
  }

  router.navigate(['/home'], {
    queryParams: { error: 'unauthorized' }
  });
  return false;
};
