import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardService } from '../../services/dashboard.service';
import { LoanApplicationService } from '../../services/loan-application.service';
import { Dashboard } from '../../models/dashboard.model';
import { LoanApplication } from '../../models/loan-application.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatToolbarModule, MatTableModule, MatButtonModule, MatChipsModule, MatDividerModule],
  providers: [DatePipe],
  template: `
    <div class="reports-container">
      <mat-toolbar>
        <span>Reports</span>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="exportCSV()">
          <mat-icon>download</mat-icon> Export CSV
        </button>
        <button mat-raised-button (click)="printReport()" class="ml-8">
          <mat-icon>print</mat-icon> Print
        </button>
      </mat-toolbar>

      <div class="stats-grid" id="stats-section">
        @for (stat of stats; track stat.label) {
          <mat-card class="stat-card">
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
        }
      </div>

      <div class="report-row">
        <mat-card class="half-card">
          <mat-card-header>
            <mat-card-title>Loan Status Breakdown</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table class="breakdown-table">
              <tbody>
                @for (b of breakdown; track b.label) {
                  <tr>
                    <td>
                      <span class="status-dot" [style.background]="b.color"></span>
                      {{ b.label }}
                    </td>
                    <td class="count">{{ b.count }}</td>
                    <td class="bar-cell">
                      <div class="bar-track">
                        <div class="bar-fill" [style.width.%]="b.percent" [style.background]="b.color"></div>
                      </div>
                    </td>
                    <td class="percent">{{ b.percent }}%</td>
                  </tr>
                }
              </tbody>
            </table>
          </mat-card-content>
        </mat-card>

        <mat-card class="half-card">
          <mat-card-header>
            <mat-card-title>Quick Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-list">
              <div class="summary-item">
                <span class="summary-label">Total Loan Applications</span>
                <span class="summary-value">{{ totalApplications }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="summary-item">
                <span class="summary-label">Approval Rate</span>
                <span class="summary-value">{{ approvalRate }}%</span>
              </div>
              <mat-divider></mat-divider>
              <div class="summary-item">
                <span class="summary-label">Total Requested Amount</span>
                <span class="summary-value">₹{{ totalRequested | number }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="summary-item">
                <span class="summary-label">Average Loan Amount</span>
                <span class="summary-value">₹{{ avgLoanAmount | number }}</span>
              </div>
              <mat-divider></mat-divider>
              <div class="summary-item">
                <span class="summary-label">Total Customers</span>
                <span class="summary-value">{{ dashboardData?.totalCustomers || 0 }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card id="recent-loans-section">
        <mat-card-header>
          <mat-card-title>Recent Loan Applications</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (recentLoans.length === 0) {
            <p class="no-data">No loan applications found</p>
          } @else {
            <table mat-table [dataSource]="recentLoans" class="full-width">
              <ng-container matColumnDef="customerName">
                <th mat-header-cell *matHeaderCellDef>Customer</th>
                <td mat-cell *matCellDef="let l">{{ l.customerName }}</td>
              </ng-container>
              <ng-container matColumnDef="loanProductName">
                <th mat-header-cell *matHeaderCellDef>Product</th>
                <td mat-cell *matCellDef="let l">{{ l.loanProductName }}</td>
              </ng-container>
              <ng-container matColumnDef="requestedAmount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let l">{{ l.requestedAmount | number }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let l">
                  <mat-chip [color]="getChipColor(l.status)" highlighted>{{ l.status }}</mat-chip>
                </td>
              </ng-container>
              <ng-container matColumnDef="applicationDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let l">{{ l.applicationDate | date }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="recentColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: recentColumns"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reports-container { padding: 24px; }
    mat-toolbar { margin-bottom: 24px; border-radius: 8px; }
    .spacer { flex: 1 1 auto; }
    .ml-8 { margin-left: 8px; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 20px; }
    .stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon mat-icon { color: #fff; font-size: 28px; width: 28px; height: 28px; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 28px; font-weight: 500; color: #333; }
    .stat-label { font-size: 13px; color: #666; margin-top: 2px; }

    .report-row { display: flex; gap: 16px; margin-bottom: 24px; }
    .half-card { flex: 1; }

    .breakdown-table { width: 100%; border-collapse: collapse; }
    .breakdown-table td { padding: 10px 8px; }
    .status-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
    .count { font-weight: 500; text-align: center; width: 40px; }
    .bar-cell { width: 100%; }
    .bar-track { height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .percent { text-align: right; color: #666; width: 50px; }

    .summary-list { display: flex; flex-direction: column; }
    .summary-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
    .summary-label { color: #666; }
    .summary-value { font-weight: 500; color: #333; }

    .full-width { width: 100%; }
    .no-data { text-align: center; color: #999; padding: 24px; }

    @media print {
      .reports-container { padding: 0; }
      mat-toolbar { display: none; }
      .stat-card { break-inside: avoid; }
    }
  `]
})
export class ReportsComponent implements OnInit {
  stats: any[] = [];
  dashboardData: Dashboard | null = null;
  allLoans: LoanApplication[] = [];
  recentLoans: LoanApplication[] = [];
  breakdown: any[] = [];
  totalApplications = 0;
  totalRequested = 0;
  avgLoanAmount = 0;
  approvalRate = 0;
  recentColumns = ['customerName', 'loanProductName', 'requestedAmount', 'status', 'applicationDate'];

  constructor(
    private dashboardService: DashboardService,
    private loanApplicationService: LoanApplicationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dashboardService.getStats().subscribe(data => {
      this.dashboardData = data;
      this.buildStats(data);
    });

    this.loanApplicationService.getAll().subscribe(loans => {
      this.allLoans = loans;
      this.totalApplications = loans.length;
      this.totalRequested = loans.reduce((sum, l) => sum + (l.requestedAmount || 0), 0);
      this.avgLoanAmount = this.totalApplications > 0 ? Math.round(this.totalRequested / this.totalApplications) : 0;
      this.recentLoans = [...loans].sort((a, b) => {
        const dateA = a.applicationDate ? new Date(a.applicationDate).getTime() : 0;
        const dateB = b.applicationDate ? new Date(b.applicationDate).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 10);
      this.buildBreakdown(loans);
    });
  }

  private buildStats(data: Dashboard): void {
    this.stats = [
      { label: 'Total Customers', value: data.totalCustomers, icon: 'people', color: '#1976d2' },
      { label: 'Pending Loans', value: data.pendingLoans, icon: 'hourglass_empty', color: '#f57c00' },
      { label: 'Approved Loans', value: data.approvedLoans, icon: 'check_circle', color: '#388e3c' },
      { label: 'Rejected Loans', value: data.rejectedLoans, icon: 'cancel', color: '#d32f2f' },
      { label: 'Sanctioned Amount', value: '₹' + (data.totalSanctionedAmount || 0).toLocaleString(), icon: 'payments', color: '#7b1fa2' },
      { label: 'Avg Credit Score', value: data.averageCreditScore, icon: 'trending_up', color: '#00796b' }
    ];
  }

  private buildBreakdown(loans: LoanApplication[]): void {
    const statusMap = new Map<string, number>();
    for (const l of loans) {
      const status = l.status || 'UNKNOWN';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    }
    const total = loans.length || 1;
    const colors: Record<string, string> = {
      PENDING: '#f57c00', APPROVED: '#388e3c', REJECTED: '#d32f2f',
      ON_HOLD: '#1976d2', ELIGIBLE: '#43a047', NOT_ELIGIBLE: '#e64a19'
    };
    this.breakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
      label: status === 'NOT_ELIGIBLE' ? 'NOT ELIGIBLE' : status,
      count,
      percent: Math.round((count / total) * 100),
      color: colors[status] || '#757575'
    }));
    const approved = statusMap.get('APPROVED') || 0;
    const rejected = statusMap.get('REJECTED') || 0;
    const decided = approved + rejected;
    this.approvalRate = decided > 0 ? Math.round((approved / decided) * 100) : 0;
  }

  getChipColor(status: string): string {
    switch (status) {
      case 'APPROVED': case 'ELIGIBLE': return 'primary';
      case 'REJECTED': case 'NOT_ELIGIBLE': return 'warn';
      case 'PENDING': case 'ON_HOLD': return 'accent';
      default: return '';
    }
  }

  exportCSV(): void {
    const headers = ['Customer', 'Product', 'Amount', 'Status', 'Date'];
    const rows = this.allLoans.map(l => [
      `"${l.customerName || ''}"`,
      `"${l.loanProductName || ''}"`,
      l.requestedAmount,
      l.status,
      l.applicationDate ? this.datePipe.transform(l.applicationDate, 'yyyy-MM-dd') : ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  printReport(): void {
    window.print();
  }
}
