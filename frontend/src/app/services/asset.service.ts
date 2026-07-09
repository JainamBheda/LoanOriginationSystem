import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Asset } from '../models/asset.model';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private apiUrl = `${environment.apiUrl}/assets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Asset[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(map(assets => assets.map(a => this.mapAsset(a))));
  }

  create(asset: Asset): Observable<Asset> {
    return this.http.post<any>(this.apiUrl, asset).pipe(map(a => this.mapAsset(a)));
  }

  update(id: number, asset: Asset): Observable<Asset> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, asset).pipe(map(a => this.mapAsset(a)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapAsset(asset: any): Asset {
    return {
      id: asset.id,
      customerId: asset.customer?.id ?? asset.customerId,
      customerName: asset.customer?.fullName ?? asset.customerName,
      assetType: asset.assetType,
      assetValue: asset.assetValue,
      ownership: asset.ownership
    };
  }
}
