import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="signup-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Register for Loan Origination System</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" placeholder="Enter full name" />
              @if (signupForm.get('fullName')?.hasError('required')) {
                <mat-error>Name is required</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter email" />
              @if (signupForm.get('email')?.hasError('required')) {
                <mat-error>Email is required</mat-error>
              }
              @if (signupForm.get('email')?.hasError('email')) {
                <mat-error>Invalid email format</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Enter password" />
              @if (signupForm.get('password')?.hasError('required')) {
                <mat-error>Password is required</mat-error>
              }
              @if (signupForm.get('password')?.hasError('minlength')) {
                <mat-error>Password must be at least 8 characters</mat-error>
              }
              @if (signupForm.get('password')?.hasError('pattern')) {
                <mat-error>Password must contain at least one letter and one number</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option [value]="Role.CUSTOMER">Customer</mat-option>
                <mat-option [value]="Role.BANK_OFFICER">Bank Officer</mat-option>
                <mat-option [value]="Role.ADMIN">Admin</mat-option>
              </mat-select>
              @if (signupForm.get('role')?.hasError('required')) {
                <mat-error>Role is required</mat-error>
              }
            </mat-form-field>
            @if (error) {
              <div class="error-message">{{ error }}</div>
            }
            @if (success) {
              <div class="success-message">{{ success }}</div>
            }
            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="signupForm.invalid || loading">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Sign Up
              }
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <span>Already have an account?</span>
          <a mat-button routerLink="/login">Sign In</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .signup-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; padding: 20px; }
    mat-card { max-width: 480px; width: 100%; padding: 24px; }
    mat-card-header { margin-bottom: 20px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .error-message { color: #f44336; margin-bottom: 16px; text-align: center; }
    .success-message { color: #4caf50; margin-bottom: 16px; text-align: center; }
    mat-card-actions { padding: 16px; justify-content: center; gap: 8px; }
    button[type="submit"] { height: 44px; }
  `]
})
export class SignupComponent implements OnInit {
  Role = Role;
  signupForm!: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
      role: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.signup(this.signupForm.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
