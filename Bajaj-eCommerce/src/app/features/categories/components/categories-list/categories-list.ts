import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CategoriesApi } from '../../services/categories-api';
import { Category } from '../../models/category';

@Component({
  selector: 'bajaj-categories-list',
  imports: [CommonModule],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css',
})
export class CategoriesList implements OnInit, OnDestroy {
  private _categoriesApi = inject(CategoriesApi);
  private _router = inject(Router);
  private _subscription = new Subscription();
  
  protected categories: Category[] = [];
  protected loading = true;
  protected readonly title: string = "Product Categories";
  protected currentPage = 1;
  protected itemsPerPage = 6; // 2 rows of 3 categories each
  protected totalPages = 0;
  protected paginatedCategories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  protected loadCategories(): void {
    this.loading = true;
    this._subscription = this._categoriesApi.getCategories().subscribe({
      next: data => {
        if (data.success) {
          this.categories = data.data;
          this.calculatePagination();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.loading = false;
      }
    });
  }

  private calculatePagination(): void {
    if (this.categories && this.categories.length > 0) {
      this.totalPages = Math.ceil(this.categories.length / this.itemsPerPage);
      this.updatePaginatedCategories();
    }
  }

  private updatePaginatedCategories(): void {
    if (this.categories && this.categories.length > 0) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedCategories = this.categories.slice(startIndex, endIndex);
    } else {
      this.paginatedCategories = [];
    }
  }

  protected onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedCategories();
    const element = document.getElementById('categories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  protected getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.categories?.length || 0);
  }

  protected navigateToCategory(categoryId: string): void {
    // Show products page filtered by the selected category
    this._router.navigate(['/products/category', categoryId]);
  }

  protected navigateToProducts(): void {
    this._router.navigate(['/products']);
  }
}
