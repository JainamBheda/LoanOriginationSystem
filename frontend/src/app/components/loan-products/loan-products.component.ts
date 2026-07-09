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
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { LoanProductService } from '../../services/loan-product.service';
import { LoanProduct } from '../../models/loan-product.model';

@Component({
  selector: 'app-loan-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatToolbarModule, MatSnackBarModule],
  template: `
    <div class="lp-container">
      <mat-toolbar>
        <span>Loan Products</span>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Product
        </button>
      </mat-toolbar>

      @if (showForm) {
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>{{ editingProduct ? 'Edit' : 'Add' }} Loan Product</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="productForm">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Loan Name</mat-label>
                  <input matInput formControlName="loanName" />
                  @if (productForm.get('loanName')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Interest Rate (%)</mat-label>
                  <input matInput type="number" step="0.01" formControlName="interestRate" />
                  @if (productForm.get('interestRate')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Maximum Amount</mat-label>
                  <input matInput type="number" formControlName="maximumAmount" />
                  @if (productForm.get('maximumAmount')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  } @else if (productForm.get('maximumAmount')?.hasError('min')) {
                    <mat-error>Must be greater than 0</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Tenure (Months)</mat-label>
                  <input matInput type="number" formControlName="tenureMonths" />
                  @if (productForm.get('tenureMonths')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  } @else if (productForm.get('tenureMonths')?.hasError('min')) {
                    <mat-error>Must be greater than 0</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Processing Fee</mat-label>
                  <input matInput type="number" formControlName="processingFee" />
                  @if (productForm.get('processingFee')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  }
                </mat-form-field>
              </div>
            </form>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="cancelForm()">Cancel</button>
            <button mat-raised-button color="primary" (click)="saveProduct()" [disabled]="productForm.invalid">
              {{ editingProduct ? 'Update' : 'Save' }}
            </button>
          </mat-card-actions>
        </mat-card>
      }

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="loanName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let p">{{ p.loanName }}</td>
            </ng-container>
            <ng-container matColumnDef="interestRate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Rate</th>
              <td mat-cell *matCellDef="let p">{{ p.interestRate }}%</td>
            </ng-container>
            <ng-container matColumnDef="maximumAmount">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Max Amount</th>
              <td mat-cell *matCellDef="let p">{{ p.maximumAmount | number }}</td>
            </ng-container>
            <ng-container matColumnDef="tenureMonths">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Tenure</th>
              <td mat-cell *matCellDef="let p">{{ p.tenureMonths }} months</td>
            </ng-container>
            <ng-container matColumnDef="processingFee">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Fee</th>
              <td mat-cell *matCellDef="let p">{{ p.processingFee | number }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let p">
                <button mat-icon-button color="primary" (click)="editProduct(p)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteProduct(p)"><mat-icon>delete</mat-icon></button>
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
    .lp-container { padding: 24px; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .spacer { flex: 1 1 auto; }
    .form-card { margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .full-width { width: 100%; }
    mat-card-actions { padding: 16px; }
  `]
})
export class LoanProductsComponent implements OnInit {
  columns = ['loanName', 'interestRate', 'maximumAmount', 'tenureMonths', 'processingFee', 'actions'];
  dataSource = new MatTableDataSource<LoanProduct>([]);
  showForm = false;
  editingProduct: LoanProduct | null = null;
  productForm!: FormGroup;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private loanProductService: LoanProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      loanName: ['', Validators.required],
      interestRate: [null, [Validators.required, Validators.min(0)]],
      maximumAmount: [null, [Validators.required, Validators.min(1)]],
      tenureMonths: [null, [Validators.required, Validators.min(1)]],
      processingFee: [null, [Validators.required, Validators.min(0)]]
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.loanProductService.getAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingProduct = null;
    this.productForm.reset();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingProduct = null;
  }

  editProduct(product: LoanProduct): void {
    this.showForm = true;
    this.editingProduct = product;
    this.productForm.patchValue(product);
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    const data = this.productForm.value;
    if (this.editingProduct) {
      this.loanProductService.update(this.editingProduct.id!, data).subscribe({
        next: () => {
          this.snackBar.open('Loan product updated successfully', 'Close', { duration: 3000 });
          this.loadProducts();
          this.cancelForm();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to update loan product', 'Close', { duration: 5000 })
      });
    } else {
      this.loanProductService.create(data).subscribe({
        next: () => {
          this.snackBar.open('Loan product created successfully', 'Close', { duration: 3000 });
          this.loadProducts();
          this.cancelForm();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to create loan product', 'Close', { duration: 5000 })
      });
    }
  }

  deleteProduct(product: LoanProduct): void {
    if (confirm(`Delete loan product "${product.loanName}"?`)) {
      this.loanProductService.delete(product.id!).subscribe({
        next: () => {
          this.snackBar.open('Loan product deleted successfully', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: () => this.snackBar.open('Failed to delete loan product', 'Close', { duration: 3000 })
      });
    }
  }
}
