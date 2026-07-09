import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoanProduct } from '../models/loan-product.model';

@Injectable({ providedIn: 'root' })
export class LoanProductService {
  private apiUrl = `${environment.apiUrl}/loan-products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LoanProduct[]> {
    return this.http.get<LoanProduct[]>(this.apiUrl);
  }

  create(product: LoanProduct): Observable<LoanProduct> {
    return this.http.post<LoanProduct>(this.apiUrl, product);
  }

  update(id: number, product: LoanProduct): Observable<LoanProduct> {
    return this.http.put<LoanProduct>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
