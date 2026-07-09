import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoanApplication } from '../models/loan-application.model';

@Injectable({ providedIn: 'root' })
export class LoanApplicationService {
  private apiUrl = `${environment.apiUrl}/loan`;

  constructor(private http: HttpClient) {}

  apply(application: LoanApplication): Observable<LoanApplication> {
    return this.http.post<any>(`${this.apiUrl}/apply`, application).pipe(map(a => this.mapLoan(a)));
  }

  getAll(): Observable<LoanApplication[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(map(loans => loans.map(l => this.mapLoan(l))));
  }

  getById(id: number): Observable<LoanApplication> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(l => this.mapLoan(l)));
  }

  update(id: number, application: LoanApplication): Observable<LoanApplication> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, application).pipe(map(a => this.mapLoan(a)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approve(id: number, approvedAmount?: number, remarks?: string): Observable<LoanApplication> {
    return this.http.put<any>(`${this.apiUrl}/${id}/approve`, { approvedAmount, remarks })
      .pipe(map(a => this.mapLoan(a)));
  }

  reject(id: number, remarks?: string): Observable<LoanApplication> {
    return this.http.put<any>(`${this.apiUrl}/${id}/reject`, { remarks })
      .pipe(map(a => this.mapLoan(a)));
  }

  hold(id: number, remarks?: string): Observable<LoanApplication> {
    return this.http.put<any>(`${this.apiUrl}/${id}/hold`, { remarks })
      .pipe(map(a => this.mapLoan(a)));
  }

  private mapLoan(loan: any): LoanApplication {
    return {
      id: loan.id,
      customerId: loan.customer?.id ?? loan.customerId,
      customerName: loan.customer?.fullName ?? loan.customerName,
      loanProductId: loan.loanProduct?.id ?? loan.loanProductId,
      loanProductName: loan.loanProduct?.loanName ?? loan.loanProductName,
      requestedAmount: loan.requestedAmount,
      approvedAmount: loan.approvedAmount,
      tenure: loan.tenure,
      applicationDate: loan.applicationDate,
      status: loan.status,
      remarks: loan.remarks
    };
  }
}
