import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatGridListModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <mat-card class="stat-card" *ngFor="let stat of stats">
          <mat-card-content>
            <div class="stat-icon" [style.background]="stat.color">
              <mat-icon>{{ stat.icon }}</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 24px; }
    h1 { margin-bottom: 24px; font-size: 28px; font-weight: 400; color: #333; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .stat-card mat-card-content { display: flex; align-items: center; gap: 20px; padding: 20px; }
    .stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .stat-icon mat-icon { color: #fff; font-size: 32px; width: 32px; height: 32px; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 32px; font-weight: 500; color: #333; }
    .stat-label { font-size: 14px; color: #666; margin-top: 4px; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data: Dashboard) => {
        this.stats = [
          { label: 'Total Customers', value: data.totalCustomers, icon: 'people', color: '#1976d2' },
          { label: 'Pending Loans', value: data.pendingLoans, icon: 'hourglass_empty', color: '#f57c00' },
          { label: 'Approved Loans', value: data.approvedLoans, icon: 'check_circle', color: '#388e3c' },
          { label: 'Rejected Loans', value: data.rejectedLoans, icon: 'cancel', color: '#d32f2f' },
          { label: 'Total Sanctioned Amount', value: '₹' + (data.totalSanctionedAmount || 0).toLocaleString(), icon: 'payments', color: '#7b1fa2' },
          { label: 'Avg Credit Score', value: data.averageCreditScore, icon: 'trending_up', color: '#00796b' }
        ];
      }
    });
  }
}
