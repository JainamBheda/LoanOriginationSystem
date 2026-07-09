import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { LoanApplicationService } from '../../services/loan-application.service';
import { LoanProductService } from '../../services/loan-product.service';
import { LoanProduct } from '../../models/loan-product.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatToolbarModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="apply-container">
      <mat-toolbar>
        <span>Apply for Loan</span>
      </mat-toolbar>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="loanForm">
            <div class="form-grid">
              @if (!isCustomer) {
                <mat-form-field appearance="outline">
                  <mat-label>Customer</mat-label>
                  <mat-select formControlName="customerId">
                    @for (c of customers; track c.id) {
                      <mat-option [value]="c.id">{{ c.fullName }} - {{ c.pan }}</mat-option>
                    }
                  </mat-select>
                  @if (loanForm.get('customerId')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  } @else if (loanForm.get('customerId')?.hasError('min')) {
                    <mat-error>Please select a customer</mat-error>
                  }
                </mat-form-field>
              } @else if (currentCustomer) {
                <div class="customer-info">
                  <strong>Applying as:</strong> {{ currentCustomer.fullName }} ({{ currentCustomer.pan }})
                </div>
              }
              <mat-form-field appearance="outline">
                <mat-label>Loan Product</mat-label>
                <mat-select formControlName="loanProductId">
                  @for (p of products; track p.id) {
                    <mat-option [value]="p.id">{{ p.loanName }} ({{ p.interestRate }}%)</mat-option>
                  }
                </mat-select>
                @if (loanForm.get('loanProductId')?.hasError('required')) {
                  <mat-error>Required</mat-error>
                } @else if (loanForm.get('loanProductId')?.hasError('min')) {
                  <mat-error>Please select a loan product</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Requested Amount</mat-label>
                <input matInput type="number" formControlName="requestedAmount" />
                @if (loanForm.get('requestedAmount')?.hasError('required')) {
                  <mat-error>Required</mat-error>
                } @else if (loanForm.get('requestedAmount')?.hasError('min')) {
                  <mat-error>Must be greater than 0</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Tenure (Months)</mat-label>
                <input matInput type="number" formControlName="tenure" />
                @if (loanForm.get('tenure')?.hasError('required')) {
                  <mat-error>Required</mat-error>
                } @else if (loanForm.get('tenure')?.hasError('min')) {
                  <mat-error>Must be greater than 0</mat-error>
                }
              </mat-form-field>
            </div>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-raised-button color="primary" (click)="applyLoan()" [disabled]="loanForm.invalid || loading">
            @if (loading) {
              <mat-spinner diameter="20"></mat-spinner>
            } @else {
              Submit Application
            }
          </button>
        </mat-card-actions>
      </mat-card>

      @if (result) {
        <mat-card [class.eligible]="result.status === 'ELIGIBLE' || result.status === 'APPROVED'"
                  [class.not-eligible]="result.status === 'NOT_ELIGIBLE' || result.status === 'REJECTED'"
                  [class.pending]="result.status === 'PENDING' || result.status === 'ON_HOLD'">
          <mat-card-header>
            <mat-icon mat-card-avatar>{{ result.status === 'ELIGIBLE' || result.status === 'APPROVED' ? 'check_circle' : result.status === 'PENDING' || result.status === 'ON_HOLD' ? 'hourglass_empty' : 'cancel' }}</mat-icon>
            <mat-card-title>Application Submitted</mat-card-title>
            <mat-card-subtitle>Status: {{ result.status }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="result-details">
              <p><strong>Loan ID:</strong> {{ result.id }}</p>
              <p><strong>Customer:</strong> {{ result.customerName }}</p>
              <p><strong>Product:</strong> {{ result.loanProductName }}</p>
              <p><strong>Amount:</strong> {{ result.requestedAmount | number }}</p>
              <p><strong>Tenure:</strong> {{ result.tenure }} months</p>
              @if (result.approvedAmount) {
                <p><strong>Approved Amount:</strong> {{ result.approvedAmount | number }}</p>
              }
              @if (result.remarks) {
                <p><strong>Remarks:</strong> {{ result.remarks }}</p>
              }
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .apply-container { padding: 24px; max-width: 800px; margin: 0 auto; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .customer-info { grid-column: span 2; padding: 12px 16px; background: #e3f2fd; border-radius: 8px; }
    mat-card-actions { padding: 16px; }
    .eligible { border-left: 4px solid #4caf50; }
    .not-eligible { border-left: 4px solid #f44336; }
    .pending { border-left: 4px solid #ff9800; }
    .result-details p { margin: 8px 0; }
    mat-card-header mat-icon { font-size: 36px; }
  `]
})
export class LoanApplicationComponent implements OnInit {
  products: LoanProduct[] = [];
  customers: Customer[] = [];
  currentCustomer: Customer | null = null;
  isCustomer = false;
  loading = false;
  result: any = null;
  loanForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loanApplicationService: LoanApplicationService,
    private loanProductService: LoanProductService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isCustomer = this.authService.getRole() === 'CUSTOMER';
    this.loanForm = this.fb.group({
      customerId: [null, [Validators.required, Validators.min(1)]],
      loanProductId: [null, [Validators.required, Validators.min(1)]],
      requestedAmount: [null, [Validators.required, Validators.min(1)]],
      tenure: [null, [Validators.required, Validators.min(1)]]
    });
    this.loanProductService.getAll().subscribe(data => this.products = data);

    if (this.isCustomer) {
      this.customerService.getMe().subscribe({
        next: (customer) => {
          this.currentCustomer = customer;
          this.loanForm.patchValue({ customerId: customer.id });
        },
        error: (err) => {
          this.snackBar.open(
            err.error?.message || 'Complete your customer profile first.',
            'Close',
            { duration: 7000 }
          );
          this.router.navigate(['/customer-profile']);
        }
      });
    } else {
      this.customerService.getAll().subscribe(data => this.customers = data);
    }
  }

  applyLoan(): void {
    if (this.loanForm.invalid) return;
    this.loading = true;
    this.result = null;
    this.loanApplicationService.apply(this.loanForm.value).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.snackBar.open('Loan application submitted successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Failed to submit application', 'Close', { duration: 5000 });
      }
    });
  }
}
