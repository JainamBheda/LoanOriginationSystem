import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [authGuard, () => roleGuard(['ADMIN', 'BANK_OFFICER'])]
  },
  {
    path: 'assets',
    loadComponent: () => import('./components/assets/assets.component').then(m => m.AssetsComponent),
    canActivate: [authGuard, () => roleGuard(['ADMIN', 'BANK_OFFICER'])]
  },
  {
    path: 'loan-products',
    loadComponent: () => import('./components/loan-products/loan-products.component').then(m => m.LoanProductsComponent),
    canActivate: [authGuard, () => roleGuard(['ADMIN', 'BANK_OFFICER'])]
  },
  {
    path: 'customer-profile',
    loadComponent: () => import('./components/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent),
    canActivate: [authGuard, () => roleGuard(['CUSTOMER'])]
  },
  {
    path: 'loan-apply',
    loadComponent: () => import('./components/loan-application/loan-application.component').then(m => m.LoanApplicationComponent),
    canActivate: [authGuard]
  },
  {
    path: 'loans',
    loadComponent: () => import('./components/loan-details/loan-details.component').then(m => m.LoanDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'approvals',
    loadComponent: () => import('./components/approvals/approvals.component').then(m => m.ApprovalsComponent),
    canActivate: [authGuard, () => roleGuard(['ADMIN', 'BANK_OFFICER'])]
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard, () => roleGuard(['ADMIN', 'BANK_OFFICER'])]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
