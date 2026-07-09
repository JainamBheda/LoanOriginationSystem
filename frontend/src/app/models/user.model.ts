export enum Role {
  ADMIN = 'ADMIN',
  BANK_OFFICER = 'BANK_OFFICER',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType?: string;
  userId: number;
  role: string;
  email: string;
  fullName: string;
}
