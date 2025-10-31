import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../../carts/services/cart.service';
import { ToastService } from '../../../../shared/services/toast.service';

import { ProductsApi } from '../../services/products-api';
import { ProductListResponse } from "../../models/product-list-response";
import { CategoriesApi } from '../../../categories/services/categories-api';
import { Category } from '../../../categories/models/category';

@Component({
  selector: 'bajaj-products-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit, OnDestroy {
  private _productApi = inject(ProductsApi);
  private _categoriesApi = inject(CategoriesApi);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _cart = inject(CartService);
  private _toast = inject(ToastService);
  protected title: string = "All Products";
  protected product: ProductListResponse;
  protected categories: Category[] = [];
  private _subscription = new Subscription();
  protected loading = true;
  protected categoriesLoading = true;
  protected currentPage = 1;
  protected itemsPerPage = 6; // 2 rows of 3 products each
  protected totalPages = 0;
  protected paginatedProducts: any[] = [];
  protected selectedProductId = '';
  protected isDetailsVisible = false;
  protected selectedCategoryId = '';
  protected filteredProducts: any[] = [];

  ngOnInit(): void {
    // Check for category route parameter
    this._route.params.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.selectedCategoryId = categoryId;
        this.title = `Products in Category`;
      }
      this.loadProducts();
      this.loadCategories();
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private loadProducts(): void {
    this.loading = true;
    const products$ = this.selectedCategoryId
      ? this._productApi.getProductsByCategory(this.selectedCategoryId, 1, 100)
      : this._productApi.getproducts();
    this._subscription = products$.subscribe({
      next: data => {
        if (data.success) {
          this.product = {
            ...data,
            data: data.data.map(p => ({
              ...p,
              images: this.processImages(p.images)
            }))
          };
          
          // If category was already filtered server-side, still guard in case backend includes others
          this.filteredProducts = this.selectedCategoryId
            ? this.product.data.filter(product => product.categoryId?._id === this.selectedCategoryId)
            : [...this.product.data];
          
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

  private loadCategories(): void {
    this.categoriesLoading = true;
    this._categoriesApi.getCategories().subscribe({
      next: data => {
        if (data.success) {
          this.categories = data.data;
        }
        this.categoriesLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categoriesLoading = false;
      }
    });
  }

  private calculatePagination(): void {
    if (this.filteredProducts && this.filteredProducts.length > 0) {
      this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      this.updatePaginatedProducts();
    }
  }

  private updatePaginatedProducts(): void {
    if (this.filteredProducts && this.filteredProducts.length > 0) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    } else {
      this.paginatedProducts = [];
    }
  }

  protected onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
    // Scroll to top of products section
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
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts?.length || 0);
  }

  protected onCategoryFilter(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1; // Reset to first page when filtering
    // Reload from server with category filter
    this.loadProducts();
  }

  protected getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  protected navigateToProduct(productId: string): void {
    this._router.navigate(['/product', productId]);
  }

  protected navigateToCategory(categoryId: string): void {
    this._router.navigate(['/category', categoryId]);
  }

  private processImages(images: string[]): string[] {
    if (!images || images.length === 0) {
      // Return random placeholder images from public/images (img1.png to img23.png)
      const randomImages = this.getRandomImages(3);
      return randomImages;
    }
    return images.map(img => {
      // If image is already a full URL or starts with /, return as is
      if (img.startsWith('http') || img.startsWith('/')) {
        return img;
      }
      // Otherwise, assume it's a filename and prepend the images path
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

  protected onProductSelection(id: string): void {
    this.selectedProductId = id;
    this.isDetailsVisible = true;
    // Scroll to details section
    setTimeout(() => {
      const element = document.getElementById('product-details');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  protected closeDetails(): void {
    this.isDetailsVisible = false;
    this.selectedProductId = '';
  }

  protected addToCart(p: any): void {
    if (!p) return;
    const originalPrice = p.price || 0;
    const discountPercent = p.discount || 0;
    const finalPrice = originalPrice - (originalPrice * discountPercent) / 100;
    this._cart.add({
      productId: p._id || p.id,
      name: p.title || p.name,
      originalPrice,
      discountPercent,
      finalPrice,
      quantity: 1,
      imageUrl: (p.images && p.images[0]) || undefined,
    });
    this._toast.show('Item added to cart', 'success');
  }

  protected getCurrentPrice(product: any): number {
    return product.price - (product.price * product.discount / 100);
  }
}
