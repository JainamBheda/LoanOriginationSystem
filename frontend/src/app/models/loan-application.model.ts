export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ON_HOLD = 'ON_HOLD',
  ELIGIBLE = 'ELIGIBLE',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE'
}

export interface LoanApplication {
  id?: number;
  customerId?: number;
  customerName?: string;
  loanProductId?: number;
  loanProductName?: string;
  requestedAmount: number;
  approvedAmount?: number;
  tenure: number;
  applicationDate?: string;
  status: LoanStatus;
  remarks?: string;
}
