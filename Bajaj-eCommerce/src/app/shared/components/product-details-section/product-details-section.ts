import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsApi } from '../../../features/products/services/products-api';
import { CartService } from '../../../features/carts/services/cart.service';
import { ToastService } from '../../services/toast.service';
import { ProductDetailsResponse } from '../../../features/products/models/product-details-response';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bajaj-product-details-section',
  imports: [CommonModule],
  templateUrl: './product-details-section.html',
  styleUrl: './product-details-section.css',
})
export class ProductDetailsSection implements OnInit, OnDestroy {
  private _productsApi = inject(ProductsApi);
  private _subscription = new Subscription();
  private _cart = inject(CartService);
  private _toast = inject(ToastService);
  
  @Input() productId: string = '';
  @Input() isVisible: boolean = false;
  
  protected product: ProductDetailsResponse | null = null;
  protected loading = false;
  protected currentImageIndex = 0;

  protected addToCart(): void {
    const p: any = this.product?.data;
    if (!p) return;
    const originalPrice = p.price || 0;
    const discountPercent = p.discount || 0;
    const finalPrice = originalPrice - (originalPrice * discountPercent) / 100;
    this._cart.add({
      productId: p._id,
      name: p.name,
      originalPrice,
      discountPercent,
      finalPrice,
      quantity: 1,
      imageUrl: (p.images && p.images[0]) || undefined,
    });
    this._toast.show('Item added to cart', 'success');
  }

  ngOnInit() {
    if (this.productId && this.isVisible) {
      this.loadProduct();
    }
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  ngOnChanges() {
    if (this.productId && this.isVisible) {
      this.loadProduct();
    }
  }

  private loadProduct(): void {
    if (!this.productId) return;
    
    this.loading = true;
    this._subscription = this._productsApi.getProductDetails(this.productId).subscribe({
      next: (response) => {
        if (response.success) {
          this.product = {
            ...response,
            data: {
              ...response.data,
              images: this.processImages(response.data.images)
            }
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.loading = false;
      }
    });
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

  protected getCurrentPrice(): number {
    if (!this.product?.data) return 0;
    return this.product.data.price - (this.product.data.price * this.product.data.discount / 100);
  }

  protected nextImage(): void {
    if (this.product?.data?.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.data.images.length;
    }
  }

  protected prevImage(): void {
    if (this.product?.data?.images) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.data.images.length) % this.product.data.images.length;
    }
  }

  protected closeDetails(): void {
    this.isVisible = false;
  }
}

