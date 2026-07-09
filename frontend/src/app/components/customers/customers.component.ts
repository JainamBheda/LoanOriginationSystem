import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { CreditScoreService } from '../../services/credit-score.service';
import { Customer, UserOption } from '../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCardModule, MatToolbarModule, MatSnackBarModule
  ],
  template: `
    <div class="customers-container">
      <mat-toolbar>
        <span>Customer Management</span>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Customer
        </button>
      </mat-toolbar>

      @if (showForm) {
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>{{ editingCustomer ? 'Edit' : 'Add' }} Customer</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="customerForm">
              <div class="form-grid">
                <mat-form-field appearance="outline" class="full-span">
                  <mat-label>Link to User Account</mat-label>
                  <mat-select formControlName="userId">
                    @for (u of availableUsers; track u.id) {
                      <mat-option [value]="u.id">{{ u.fullName }} ({{ u.email }})</mat-option>
                    }
                  </mat-select>
                  @if (customerForm.get('userId')?.hasError('required')) {
                    <mat-error>Select a customer user account</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="fullName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Date of Birth</mat-label>
                  <input matInput type="date" formControlName="dob" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>PAN</mat-label>
                  <input matInput formControlName="pan" placeholder="ABCDE1234F" style="text-transform:uppercase" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Aadhaar</mat-label>
                  <input matInput formControlName="aadhaar" placeholder="123456789012" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Phone</mat-label>
                  <input matInput formControlName="phone" placeholder="9876543210" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" />
                </mat-form-field>
                <mat-form-field appearance="outline" class="full-span">
                  <mat-label>Address</mat-label>
                  <textarea matInput formControlName="address" rows="2"></textarea>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Occupation</mat-label>
                  <input matInput formControlName="occupation" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Annual Income</mat-label>
                  <input matInput type="number" formControlName="annualIncome" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Credit Score</mat-label>
                  <input matInput type="number" formControlName="creditScore" placeholder="300-900" />
                </mat-form-field>
              </div>
            </form>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="cancelForm()">Cancel</button>
            <button mat-raised-button color="primary" (click)="saveCustomer()" [disabled]="customerForm.invalid">
              {{ editingCustomer ? 'Update' : 'Save' }}
            </button>
          </mat-card-actions>
        </mat-card>
      }

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="fullName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let c">{{ c.fullName }}</td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Phone</th>
              <td mat-cell *matCellDef="let c">{{ c.phone }}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
              <td mat-cell *matCellDef="let c">{{ c.email }}</td>
            </ng-container>
            <ng-container matColumnDef="annualIncome">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Income</th>
              <td mat-cell *matCellDef="let c">{{ c.annualIncome | number }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let c">
                <button mat-icon-button color="primary" (click)="editCustomer(c)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteCustomer(c)"><mat-icon>delete</mat-icon></button>
              </td>
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
    .customers-container { padding: 24px; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .spacer { flex: 1 1 auto; }
    .form-card { margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .full-span { grid-column: span 2; }
    .full-width { width: 100%; }
    mat-card-actions { padding: 16px; }
  `]
})
export class CustomersComponent implements OnInit {
  columns = ['fullName', 'phone', 'email', 'annualIncome', 'actions'];
  dataSource = new MatTableDataSource<Customer>([]);
  showForm = false;
  editingCustomer: Customer | null = null;
  customerForm!: FormGroup;
  availableUsers: UserOption[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  private phonePattern = /^[6-9][0-9]{9}$/;

  constructor(
    private customerService: CustomerService,
    private creditScoreService: CreditScoreService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      userId: [null, [Validators.required, Validators.min(1)]],
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      pan: ['', [Validators.required, Validators.pattern(this.panPattern)]],
      aadhaar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      occupation: ['', Validators.required],
      annualIncome: [null, [Validators.required, Validators.min(1)]],
      creditScore: [null, [Validators.min(300), Validators.max(900)]]
    });
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  loadAvailableUsers(currentUserId?: number): void {
    this.customerService.getAvailableUsers().subscribe(users => {
      this.availableUsers = users;
      if (currentUserId && !this.availableUsers.some(u => u.id === currentUserId) && this.editingCustomer?.user) {
        this.availableUsers = [{
          id: this.editingCustomer.user.id,
          fullName: this.editingCustomer.user.fullName,
          email: this.editingCustomer.user.email
        }, ...this.availableUsers];
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingCustomer = null;
    this.customerForm.reset();
    this.loadAvailableUsers();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingCustomer = null;
  }

  editCustomer(customer: Customer): void {
    this.showForm = true;
    this.editingCustomer = customer;
    this.loadAvailableUsers(customer.userId);
    this.customerForm.patchValue({ ...customer, userId: customer.userId });
    if (customer.id) {
      this.creditScoreService.getByCustomerId(customer.id).subscribe({
        next: (score) => this.customerForm.patchValue({ creditScore: score.creditScore }),
        error: () => this.customerForm.patchValue({ creditScore: null })
      });
    }
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) return;
    const { creditScore, ...data } = this.customerForm.value;

    const onSuccess = (customer: Customer) => {
      if (creditScore && customer.id) {
        this.creditScoreService.update(customer.id, { creditScore, customerId: customer.id }).subscribe({
          error: () => this.snackBar.open('Customer saved but credit score update failed', 'Close', { duration: 4000 })
        });
      }
      this.snackBar.open('Customer saved successfully', 'Close', { duration: 3000 });
      this.loadCustomers();
      this.cancelForm();
    };

    if (this.editingCustomer?.id) {
      this.customerService.update(this.editingCustomer.id, data).subscribe({
        next: onSuccess,
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to update customer', 'Close', { duration: 5000 })
      });
    } else {
      this.customerService.create(data).subscribe({
        next: onSuccess,
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to create customer', 'Close', { duration: 5000 })
      });
    }
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Delete customer "${customer.fullName}"?`)) {
      this.customerService.delete(customer.id!).subscribe({
        next: () => {
          this.snackBar.open('Customer deleted successfully', 'Close', { duration: 3000 });
          this.loadCustomers();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to delete customer', 'Close', { duration: 5000 })
      });
    }
  }
}
