import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Category } from "../../categories/models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoriesApi {
  private _baseUrl: string = "http://localhost:9090/api";
  private _httpClient = inject(HttpClient);

  // Backend returns: { categories: Category[] }
  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this._httpClient
      .get<{ categories: Category[] }>(`${this._baseUrl}/categories`)
      .pipe(map(r => ({ success: true, data: r.categories })));
  }

  // Prefer backend route if available; if not, caller can fall back by listing all
  getCategoryById(id: string): Observable<{ success: boolean; data: Category }> {
    return this._httpClient
      .get<{ category: Category }>(`${this._baseUrl}/categories/${id}`)
      .pipe(map(r => ({ success: true, data: r.category })));
  }

  createCategory(category: Partial<Category>): Observable<{ success: boolean; data: Category }> {
    return this._httpClient
      .post<{ category: Category }>(`${this._baseUrl}/categories`, category)
      .pipe(map(r => ({ success: true, data: r.category })));
  }

  updateCategory(id: string, category: Partial<Category>): Observable<{ success: boolean; data: Category }> {
    return this._httpClient
      .put<{ category: Category }>(`${this._baseUrl}/categories/${id}`, category)
      .pipe(map(r => ({ success: true, data: r.category })));
  }

  deleteCategory(id: string): Observable<{ success: boolean; message?: string }> {
    return this._httpClient
      .delete<{ success?: boolean; message?: string }>(`${this._baseUrl}/categories/${id}`)
      .pipe(map(r => ({ success: r.success ?? true, message: r.message })));
  }
}

