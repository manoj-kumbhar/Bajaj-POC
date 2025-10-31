import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private _baseUrl = 'http://localhost:9090/api';
  private _http = inject(HttpClient);
  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': token ? `Bearer ${token}` : '' });
  }

  createOrder(payload: any): Observable<any> {
    return this._http.post(`${this._baseUrl}/orders`, payload, { headers: this.authHeaders() });
  }

  getOrders(): Observable<any> { return this._http.get(`${this._baseUrl}/orders`, { headers: this.authHeaders() }); }
  getMyOrders(): Observable<any> { return this._http.get(`${this._baseUrl}/orders`, { headers: this.authHeaders() }); }
  getOrderById(id: string): Observable<any> { return this._http.get(`${this._baseUrl}/orders/${id}`, { headers: this.authHeaders() }); }
  updateStatus(id: string, status: string): Observable<any> { return this._http.put(`${this._baseUrl}/orders/${id}/status`, { status }, { headers: this.authHeaders() }); }
}


