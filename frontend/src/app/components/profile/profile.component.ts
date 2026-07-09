import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatToolbarModule, MatChipsModule, MatDividerModule],
  template: `
    <div class="profile-container">
      <mat-toolbar>
        <span>My Profile</span>
      </mat-toolbar>

      <mat-card>
        <mat-card-content>
          <div class="profile-header">
            <mat-icon class="avatar">account_circle</mat-icon>
            <div class="profile-info">
              <h2>{{ user?.fullName }}</h2>
              <p>{{ user?.email }}</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="profile-details">
            <div class="detail-row">
              <span class="label">Role:</span>
              <span class="value"><mat-chip>{{ user?.role }}</mat-chip></span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">{{ user?.email }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container { padding: 24px; max-width: 600px; margin: 0 auto; }
    mat-toolbar { margin-bottom: 20px; border-radius: 8px; }
    .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .avatar { font-size: 72px; width: 72px; height: 72px; color: #1976d2; }
    .profile-info h2 { margin: 0; font-size: 24px; }
    .profile-info p { margin: 4px 0 0; color: #666; }
    .profile-details { margin-top: 20px; }
    .detail-row { display: flex; align-items: center; padding: 12px 0; gap: 16px; }
    .label { font-weight: 500; min-width: 100px; color: #666; }
  `]
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }
}
