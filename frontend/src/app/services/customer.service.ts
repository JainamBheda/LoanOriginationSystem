import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer, UserOption } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(map(customers => customers.map(c => this.mapCustomer(c))));
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(c => this.mapCustomer(c)));
  }

  getMe(): Observable<Customer> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(map(c => this.mapCustomer(c)));
  }

  getAvailableUsers(): Observable<UserOption[]> {
    return this.http.get<UserOption[]>(`${this.apiUrl}/available-users`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<any>(this.apiUrl, customer).pipe(map(c => this.mapCustomer(c)));
  }

  createMyProfile(customer: Customer): Observable<Customer> {
    const { userId, user, id, creditScore, ...payload } = customer;
    return this.http.post<any>(`${this.apiUrl}/me`, payload).pipe(map(c => this.mapCustomer(c)));
  }

  updateMyProfile(customer: Customer): Observable<Customer> {
    const { userId, user, id, creditScore, ...payload } = customer;
    return this.http.put<any>(`${this.apiUrl}/me`, payload).pipe(map(c => this.mapCustomer(c)));
  }

  update(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer).pipe(map(c => this.mapCustomer(c)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapCustomer(customer: any): Customer {
    return {
      id: customer.id,
      userId: customer.user?.id ?? customer.userId,
      user: customer.user,
      fullName: customer.fullName,
      dob: customer.dob,
      pan: customer.pan,
      aadhaar: customer.aadhaar,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      occupation: customer.occupation,
      annualIncome: customer.annualIncome
    };
  }
}
