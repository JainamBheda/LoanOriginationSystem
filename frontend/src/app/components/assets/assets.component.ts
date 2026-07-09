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
import { AssetService } from '../../services/asset.service';
import { Asset } from '../../models/asset.model';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatToolbarModule, MatSnackBarModule],
  template: `
    <div class="assets-container">
      <mat-toolbar>
        <span>Asset Management</span>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Add Asset
        </button>
      </mat-toolbar>

      @if (showForm) {
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>{{ editingAsset ? 'Edit' : 'Add' }} Asset</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="assetForm">
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Customer</mat-label>
                  <mat-select formControlName="customerId">
                    @for (c of customers; track c.id) {
                      <mat-option [value]="c.id">{{ c.fullName }} ({{ c.pan }})</mat-option>
                    }
                  </mat-select>
                  @if (assetForm.get('customerId')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  } @else if (assetForm.get('customerId')?.hasError('min')) {
                    <mat-error>Please select a customer</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Asset Type</mat-label>
                  <mat-select formControlName="assetType">
                    @for (type of assetTypes; track type.value) {
                      <mat-option [value]="type.value">{{ type.label }}</mat-option>
                    }
                  </mat-select>
                  @if (assetForm.get('assetType')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Asset Value</mat-label>
                  <input matInput type="number" formControlName="assetValue" />
                  @if (assetForm.get('assetValue')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  } @else if (assetForm.get('assetValue')?.hasError('min')) {
                    <mat-error>Must be greater than 0</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Ownership</mat-label>
                  <input matInput formControlName="ownership" placeholder="Self, Joint, etc." />
                  @if (assetForm.get('ownership')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  }
                </mat-form-field>
              </div>
            </form>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button (click)="cancelForm()">Cancel</button>
            <button mat-raised-button color="primary" (click)="saveAsset()" [disabled]="assetForm.invalid">
              {{ editingAsset ? 'Update' : 'Save' }}
            </button>
          </mat-card-actions>
        </mat-card>
      }

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="customerName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Customer</th>
              <td mat-cell *matCellDef="let a">{{ a.customerName || 'N/A' }}</td>
            </ng-container>
            <ng-container matColumnDef="assetType">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
              <td mat-cell *matCellDef="let a">{{ a.assetType }}</td>
            </ng-container>
            <ng-container matColumnDef="assetValue">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Value</th>
              <td mat-cell *matCellDef="let a">{{ a.assetValue | number }}</td>
            </ng-container>
            <ng-container matColumnDef="ownership">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Ownership</th>
              <td mat-cell *matCellDef="let a">{{ a.ownership }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let a">
                <button mat-icon-button color="primary" (click)="editAsset(a)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteAsset(a)"><mat-icon>delete</mat-icon></button>
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
    .assets-container { padding: 24px; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .spacer { flex: 1 1 auto; }
    .form-card { margin-bottom: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .full-width { width: 100%; }
    mat-card-actions { padding: 16px; }
  `]
})
export class AssetsComponent implements OnInit {
  columns = ['customerName', 'assetType', 'assetValue', 'ownership', 'actions'];
  dataSource = new MatTableDataSource<Asset>([]);
  showForm = false;
  editingAsset: Asset | null = null;
  assetForm!: FormGroup;
  customers: Customer[] = [];
  assetTypes = [
    { value: 'HOUSE', label: 'House' },
    { value: 'LAND', label: 'Land' },
    { value: 'CAR', label: 'Car' },
    { value: 'GOLD', label: 'Gold' },
    { value: 'FIXED_DEPOSIT', label: 'Fixed Deposit' },
    { value: 'INVESTMENTS', label: 'Investments' }
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private assetService: AssetService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.assetForm = this.fb.group({
      customerId: [null, [Validators.required, Validators.min(1)]],
      assetType: ['', Validators.required],
      assetValue: [null, [Validators.required, Validators.min(1)]],
      ownership: ['', Validators.required]
    });
    this.loadAssets();
    this.customerService.getAll().subscribe(data => this.customers = data);
  }

  loadAssets(): void {
    this.assetService.getAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingAsset = null;
    this.assetForm.reset();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingAsset = null;
  }

  editAsset(asset: Asset): void {
    this.showForm = true;
    this.editingAsset = asset;
    this.assetForm.patchValue(asset);
  }

  saveAsset(): void {
    if (this.assetForm.invalid) return;
    const data = this.assetForm.value;
    if (this.editingAsset) {
      this.assetService.update(this.editingAsset.id!, data).subscribe({
        next: () => {
          this.snackBar.open('Asset updated successfully', 'Close', { duration: 3000 });
          this.loadAssets();
          this.cancelForm();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to update asset', 'Close', { duration: 5000 })
      });
    } else {
      this.assetService.create(data).subscribe({
        next: () => {
          this.snackBar.open('Asset created successfully', 'Close', { duration: 3000 });
          this.loadAssets();
          this.cancelForm();
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Failed to create asset', 'Close', { duration: 5000 })
      });
    }
  }

  deleteAsset(asset: Asset): void {
    if (confirm(`Delete ${asset.assetType} asset valued at ${asset.assetValue}?`)) {
      this.assetService.delete(asset.id!).subscribe({
        next: () => {
          this.snackBar.open('Asset deleted successfully', 'Close', { duration: 3000 });
          this.loadAssets();
        },
        error: () => this.snackBar.open('Failed to delete asset', 'Close', { duration: 3000 })
      });
    }
  }
}
