import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { LoanApplicationService } from '../../services/loan-application.service';
import { LoanApplication } from '../../models/loan-application.model';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule, MatChipsModule],
  template: `
    <div class="loans-container">
      <mat-toolbar>
        <span>Loan Applications</span>
      </mat-toolbar>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="customerName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
              <td mat-cell *matCellDef="let l">{{ l.customerName }}</td>
            </ng-container>
            <ng-container matColumnDef="loanProductName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Product</th>
              <td mat-cell *matCellDef="let l">{{ l.loanProductName }}</td>
            </ng-container>
            <ng-container matColumnDef="requestedAmount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Requested</th>
              <td mat-cell *matCellDef="let l">{{ l.requestedAmount | number }}</td>
            </ng-container>
            <ng-container matColumnDef="approvedAmount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Approved</th>
              <td mat-cell *matCellDef="let l">{{ l.approvedAmount || '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
              <td mat-cell *matCellDef="let l">
                <mat-chip [color]="getChipColor(l.status)" highlighted>
                  {{ l.status === 'NOT_ELIGIBLE' ? 'NOT ELIGIBLE' : l.status }}
                </mat-chip>
              </td>
            </ng-container>
            <ng-container matColumnDef="applicationDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
              <td mat-cell *matCellDef="let l">{{ l.applicationDate | date }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .loans-container { padding: 24px; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .full-width { width: 100%; }
  `]
})
export class LoanDetailsComponent implements OnInit {
  columns = ['customerName', 'loanProductName', 'requestedAmount', 'approvedAmount', 'status', 'applicationDate'];
  dataSource = new MatTableDataSource<LoanApplication>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private loanApplicationService: LoanApplicationService) {}

  ngOnInit(): void {
    this.loanApplicationService.getAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  getChipColor(status: string): string {
    switch (status) {
      case 'APPROVED': case 'ELIGIBLE': return 'primary';
      case 'REJECTED': case 'NOT_ELIGIBLE': return 'warn';
      case 'PENDING': case 'ON_HOLD': return 'accent';
      default: return '';
    }
  }
}
