export interface Customer {
  id?: number;
  userId?: number;
  user?: { id: number; fullName: string; email: string };
  fullName: string;
  dob: string;
  pan: string;
  aadhaar: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  annualIncome: number;
  creditScore?: number;
}

export interface UserOption {
  id: number;
  fullName: string;
  email: string;
}
