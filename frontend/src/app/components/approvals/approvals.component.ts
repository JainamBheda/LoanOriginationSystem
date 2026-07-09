import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { LoanApplicationService } from '../../services/loan-application.service';
import { LoanApplication } from '../../models/loan-application.model';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule, MatChipsModule, MatSnackBarModule],
  template: `
    <div class="approvals-container">
      <mat-toolbar>
        <span>Loan Approvals</span>
      </mat-toolbar>

      @if (pendingLoans.length === 0) {
        <mat-card>
          <mat-card-content class="empty-state">
            <mat-icon>fact_check</mat-icon>
            <p>No pending loans for approval</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content>
            <table mat-table [dataSource]="pendingLoans" class="full-width">
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
                  <mat-chip [color]="l.status === 'PENDING' ? 'accent' : 'primary'" highlighted>
                    {{ l.status }}
                  </mat-chip>
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let l">
                  <button mat-raised-button color="primary" (click)="approve(l)" matTooltip="Approve">
                    <mat-icon>check_circle</mat-icon> Approve
                  </button>
                  <button mat-raised-button color="warn" (click)="reject(l)" class="ml-8" matTooltip="Reject">
                    <mat-icon>cancel</mat-icon> Reject
                  </button>
                  <button mat-raised-button (click)="hold(l)" class="ml-8" matTooltip="Hold">
                    <mat-icon>pause_circle</mat-icon> Hold
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .approvals-container { padding: 24px; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .full-width { width: 100%; }
    .ml-8 { margin-left: 8px; }
    button mat-icon { margin-right: 4px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; color: #999; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .empty-state p { font-size: 18px; }
  `]
})
export class ApprovalsComponent implements OnInit {
  columns = ['customerName', 'loanProductName', 'requestedAmount', 'status', 'actions'];
  pendingLoans: LoanApplication[] = [];

  constructor(
    private loanApplicationService: LoanApplicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingLoans();
  }

  loadPendingLoans(): void {
    this.loanApplicationService.getAll().subscribe(data => {
      this.pendingLoans = data.filter(l =>
        l.status === 'ELIGIBLE' || l.status === 'ON_HOLD' || l.status === 'PENDING' || l.status === 'NOT_ELIGIBLE'
      );
    });
  }

  approve(loan: LoanApplication): void {
    if (loan.status !== 'ELIGIBLE') {
      this.snackBar.open('Only eligible loans can be approved', 'Close', { duration: 4000 });
      return;
    }
    if (confirm(`Approve loan of ${loan.requestedAmount} for ${loan.customerName}?`)) {
      this.loanApplicationService.approve(loan.id!, loan.requestedAmount).subscribe({
        next: () => {
          this.snackBar.open('Loan approved successfully', 'Close', { duration: 3000 });
          this.loadPendingLoans();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to approve loan', 'Close', { duration: 5000 })
      });
    }
  }

  reject(loan: LoanApplication): void {
    if (confirm(`Reject loan of ${loan.requestedAmount} for ${loan.customerName}?`)) {
      this.loanApplicationService.reject(loan.id!).subscribe({
        next: () => {
          this.snackBar.open('Loan rejected', 'Close', { duration: 3000 });
          this.loadPendingLoans();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to reject loan', 'Close', { duration: 5000 })
      });
    }
  }

  hold(loan: LoanApplication): void {
    this.loanApplicationService.hold(loan.id!).subscribe({
      next: () => {
        this.snackBar.open('Loan placed on hold', 'Close', { duration: 3000 });
        this.loadPendingLoans();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to hold loan', 'Close', { duration: 5000 })
    });
  }
}
