import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreditScore } from '../models/credit-score.model';

@Injectable({ providedIn: 'root' })
export class CreditScoreService {
  private apiUrl = `${environment.apiUrl}/creditscore`;

  constructor(private http: HttpClient) {}

  getByCustomerId(customerId: number): Observable<CreditScore> {
    return this.http.get<CreditScore>(`${this.apiUrl}/${customerId}`);
  }

  update(customerId: number, creditScore: CreditScore): Observable<CreditScore> {
    return this.http.put<CreditScore>(`${this.apiUrl}/${customerId}`, creditScore);
  }
}
