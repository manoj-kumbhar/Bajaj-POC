import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { CategoriesApi } from '../../services/categories-api';
import { Category } from '../../models/category';
import { ProductsApi } from '../../../products/services/products-api';
import { ProductListResponse } from '../../../products/models/product-list-response';

@Component({
  selector: 'bajaj-category-details',
  imports: [CommonModule],
  templateUrl: './category-details.html',
  styleUrl: './category-details.css',
})
export class CategoryDetails implements OnInit, OnDestroy {
  private _categoriesApi = inject(CategoriesApi);
  private _productsApi = inject(ProductsApi);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _subscription = new Subscription();
  
  protected category: Category | null = null;
  protected products: any[] = [];
  protected loading = true;
  protected categoryLoading = true;
  protected currentPage = 1;
  protected itemsPerPage = 6; // 2 rows of 3 products each
  protected totalPages = 0;
  protected paginatedProducts: any[] = [];
  protected categoryId: string = '';

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.categoryId = params['id'];
      if (this.categoryId) {
        this.loadCategory();
        this.loadProducts();
      }
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private loadCategory(): void {
    this.categoryLoading = true;
    this._categoriesApi.getCategoryById(this.categoryId).subscribe({
      next: data => {
        if (data.success) {
          this.category = data.data;
        }
        this.categoryLoading = false;
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.categoryLoading = false;
      }
    });
  }

  private loadProducts(): void {
    this.loading = true;
    this._productsApi.getProductsByCategory(this.categoryId, 1, 100).subscribe({
      next: data => {
        if (data.success) {
          this.products = data.data.map(p => ({
            ...p,
            images: this.processImages(p.images)
          }));
          this.calculatePagination();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  private calculatePagination(): void {
    if (this.products && this.products.length > 0) {
      this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
      this.updatePaginatedProducts();
    }
  }

  private updatePaginatedProducts(): void {
    if (this.products && this.products.length > 0) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedProducts = this.products.slice(startIndex, endIndex);
    } else {
      this.paginatedProducts = [];
    }
  }

  protected onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
    const element = document.getElementById('products-section');
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
    return Math.min(this.currentPage * this.itemsPerPage, this.products?.length || 0);
  }

  protected navigateToProduct(productId: string): void {
    this._router.navigate(['/product', productId]);
  }

  protected navigateToProducts(): void {
    this._router.navigate(['/products']);
  }

  protected navigateToCategories(): void {
    this._router.navigate(['/categories']);
  }

  protected getCurrentPrice(product: any): number {
    return product.price - (product.price * product.discount / 100);
  }

  private processImages(images: string[]): string[] {
    if (!images || images.length === 0) {
      const randomImages = this.getRandomImages(3);
      return randomImages;
    }
    return images.map(img => {
      if (img.startsWith('http') || img.startsWith('/')) {
        return img;
      }
      return `/images/${img}`;
    });
  }

  private getRandomImages(count: number): string[] {
    const availableImages = [
      'img1.png.png', 'img2.png.png', 'img3.png.png', 'img4.png.png', 'img5.png.png',
      'img6.png.png', 'img7.png.png', 'img8.png.png', 'img9.png.png', 'img10.png.png',
      'img11.png.png', 'img12.png.png', 'img13.png.png', 'img14.png.png', 'img15.png.png',
      'img16.png.png', 'img17.png.png', 'img18.png.png', 'img19.png.png', 'img20.png.png',
      'img21.png.png', 'img22.png.png', 'img23.png.png'
    ];
    
    const images = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      images.push(`/images/${availableImages[randomIndex]}`);
    }
    return images;
  }
}
