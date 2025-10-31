import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'bajaj-cart-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPage {
  private _cart = inject(CartService);
  private _router = inject(Router);
  private _toast = inject(ToastService);

  protected get items(): CartItem[] { return this._cart.items; }
  protected get totals() { return this._cart.totals; }

  protected inc(item: CartItem) { this._cart.updateQuantity(item.productId, item.quantity + 1); }
  protected dec(item: CartItem) {
    const newQty = item.quantity - 1;
    this._cart.updateQuantity(item.productId, newQty);
    if (newQty <= 0) this._toast.show('Item removed from cart', 'warning');
  }
  protected remove(item: CartItem) { this._cart.remove(item.productId); this._toast.show('Item removed from cart', 'warning'); }

  protected checkout(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this._router.navigate(['/login'], { queryParams: { returnurl: '/cart' } });
      return;
    }
    this._router.navigate(['/payment']);
  }
}


