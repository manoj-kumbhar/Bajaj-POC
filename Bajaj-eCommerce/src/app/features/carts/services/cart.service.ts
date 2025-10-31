import { Injectable } from '@angular/core';

export interface CartItem {
  productId: string;
  name: string;
  originalPrice: number; // MRP
  discountPercent: number; // e.g. 20 for 20%
  finalPrice: number; // price after discount
  quantity: number;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items: CartItem[] = [];

  get items(): CartItem[] {
    return [...this._items];
  }

  add(item: CartItem): void {
    const existing = this._items.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this._items.push({ ...item });
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    const it = this._items.find(i => i.productId === productId);
    if (it) {
      if (quantity <= 0) {
        this.remove(productId);
      } else {
        it.quantity = quantity;
      }
    }
  }

  remove(productId: string): void {
    this._items = this._items.filter(i => i.productId !== productId);
  }

  clear(): void {
    this._items = [];
  }

  get totals() {
    const subtotal = this._items.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
    return { subtotal, discount: 0, total: subtotal };
  }
}


