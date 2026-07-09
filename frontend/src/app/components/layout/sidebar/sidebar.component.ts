import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <div class="sidebar-header">
        <mat-icon>account_balance</mat-icon>
        <span>LOS System</span>
      </div>
      <mat-list-item routerLink="/dashboard" routerLinkActive="active">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <span matListItemTitle>Dashboard</span>
      </mat-list-item>
      @if (isAdminOrOfficer()) {
        <mat-list-item routerLink="/customers" routerLinkActive="active">
          <mat-icon matListItemIcon>people</mat-icon>
          <span matListItemTitle>Customers</span>
        </mat-list-item>
      }
      @if (isAdminOrOfficer()) {
        <mat-list-item routerLink="/assets" routerLinkActive="active">
          <mat-icon matListItemIcon>inventory_2</mat-icon>
          <span matListItemTitle>Assets</span>
        </mat-list-item>
      }
      @if (isAdminOrOfficer()) {
        <mat-list-item routerLink="/loan-products" routerLinkActive="active">
          <mat-icon matListItemIcon>card_giftcard</mat-icon>
          <span matListItemTitle>Loan Products</span>
        </mat-list-item>
      }
      @if (isCustomer()) {
        <mat-list-item routerLink="/customer-profile" routerLinkActive="active">
          <mat-icon matListItemIcon>badge</mat-icon>
          <span matListItemTitle>My Profile</span>
        </mat-list-item>
      }
      <mat-list-item routerLink="/loan-apply" routerLinkActive="active">
        <mat-icon matListItemIcon>add_circle</mat-icon>
        <span matListItemTitle>Apply Loan</span>
      </mat-list-item>
      <mat-list-item routerLink="/loans" routerLinkActive="active">
        <mat-icon matListItemIcon>receipt_long</mat-icon>
        <span matListItemTitle>Loan Details</span>
      </mat-list-item>
      @if (isAdminOrOfficer()) {
        <mat-list-item routerLink="/approvals" routerLinkActive="active">
          <mat-icon matListItemIcon>fact_check</mat-icon>
          <span matListItemTitle>Approvals</span>
        </mat-list-item>
      }
      @if (isAdminOrOfficer()) {
        <mat-list-item routerLink="/reports" routerLinkActive="active">
          <mat-icon matListItemIcon>assessment</mat-icon>
          <span matListItemTitle>Reports</span>
        </mat-list-item>
      }
      <mat-list-item routerLink="/profile" routerLinkActive="active">
        <mat-icon matListItemIcon>person</mat-icon>
        <span matListItemTitle>Profile</span>
      </mat-list-item>
    </mat-nav-list>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; background: #1a237e; color: #fff; }
    .sidebar-header { display: flex; align-items: center; gap: 8px; padding: 20px 16px; font-size: 20px; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.12); }
    .sidebar-header mat-icon { font-size: 28px; width: 28px; height: 28px; }
    mat-nav-list { padding-top: 0; }
    mat-list-item { color: rgba(255,255,255,0.87); cursor: pointer; }
    mat-list-item:hover { background: rgba(255,255,255,0.08); }
    ::ng-deep .mat-list-item-content { gap: 12px; }
    .active { background: rgba(255,255,255,0.12) !important; border-left: 3px solid #ffd740; }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  isAdminOrOfficer(): boolean {
    const role = this.authService.getRole();
    return role === 'ADMIN' || role === 'BANK_OFFICER';
  }

  isCustomer(): boolean {
    return this.authService.getRole() === 'CUSTOMER';
  }
}
