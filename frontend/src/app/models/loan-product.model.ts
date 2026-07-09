export interface LoanProduct {
  id?: number;
  loanName: string;
  interestRate: number;
  maximumAmount: number;
  tenureMonths: number;
  processingFee: number;
}
