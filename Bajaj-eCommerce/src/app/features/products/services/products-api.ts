import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { ProductListResponse } from '../models/product-list-response';
import { ProductDetailsResponse } from '../models/product-details-response';

@Injectable({
  providedIn: 'root'
})
export class ProductsApi {
  private _baseUrl: string = "http://localhost:9090/api";
  private _httpClient = inject(HttpClient);

  getproducts(): Observable<ProductListResponse> {
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products`);
  }

  getProductsByCategory(categoryId: string, page: number = 1, limit: number = 50): Observable<ProductListResponse> {
    const params = `?category=${encodeURIComponent(categoryId)}&page=${page}&limit=${limit}`;
    return this._httpClient.get<ProductListResponse>(`${this._baseUrl}/products${params}`);
  }

  getProductDetails(id: string): Observable<ProductDetailsResponse> {
    return this._httpClient.get<ProductDetailsResponse>(`${this._baseUrl}/products/${id}`);
  }

  createProduct(payload: any): Observable<any> {
    return this._httpClient.post(`${this._baseUrl}/products`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
