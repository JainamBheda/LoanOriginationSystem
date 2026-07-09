import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatToolbarModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <mat-toolbar>
        <span>{{ isEdit ? 'Update' : 'Complete' }} Customer Profile</span>
      </mat-toolbar>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Profile Details</mat-card-title>
          <mat-card-subtitle>Required before you can apply for a loan</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
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
            </div>
            <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || loading">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                {{ isEdit ? 'Update Profile' : 'Save Profile' }}
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container { padding: 24px; max-width: 900px; margin: 0 auto; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
    .full-span { grid-column: span 2; }
    button[type="submit"] { min-width: 160px; height: 44px; }
  `]
})
export class CustomerProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  isEdit = false;

  private panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  private phonePattern = /^[6-9][0-9]{9}$/;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      dob: ['', Validators.required],
      pan: ['', [Validators.required, Validators.pattern(this.panPattern)]],
      aadhaar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      occupation: ['', Validators.required],
      annualIncome: [null, [Validators.required, Validators.min(1)]]
    });

    const user = this.authService.getUser();
    if (user) {
      this.profileForm.patchValue({ fullName: user.fullName, email: user.email });
    }

    this.customerService.getMe().subscribe({
      next: (customer) => {
        this.isEdit = true;
        this.profileForm.patchValue(customer);
      },
      error: () => { this.isEdit = false; }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.loading = true;
    const request = this.isEdit
      ? this.customerService.updateMyProfile(this.profileForm.value)
      : this.customerService.createMyProfile(this.profileForm.value);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Profile saved successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/loan-apply']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Failed to save profile', 'Close', { duration: 5000 });
      }
    });
  }
}
