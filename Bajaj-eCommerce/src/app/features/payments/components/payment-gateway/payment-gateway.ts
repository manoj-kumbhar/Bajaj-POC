import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../carts/services/cart.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { OrdersApi } from '../../../orders/services/orders-api';
import { OrderItem, ShippingAddress, PaymentInfo } from '../../../orders/models/order';
import { CartApi } from '../../../carts/services/cart-api';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'bajaj-payment-gateway',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-gateway.html',
  styleUrls: ['./payment-gateway.css']
})
export class PaymentGateway {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _cart = inject(CartService);
  private _toast = inject(ToastService);
  private _orders = inject(OrdersApi);
  private _cartApi = inject(CartApi);

  protected form = this._fb.group({
    method: ['upi', Validators.required],
    upiId: ['', []],
    cardNumber: ['', []],
    cardName: ['', []],
    expiry: ['', []],
    cvv: ['', []],
  });

  protected processing = false;
  protected error = '';

  protected payNow(): void {
    if (this.processing) return;
    this.processing = true;
    const items: OrderItem[] = this._cart.items.map(i => ({
      productId: i.productId,
      name: i.name,
      quantity: i.quantity,
      price: i.finalPrice,
      total: i.finalPrice * i.quantity,
    }));
    const address: ShippingAddress = { street: '221B Baker Street', city: 'London', state: 'London', postalCode: 'NW16XE', country: 'UK' };
    const payment: PaymentInfo = { method: this.form.value.method === 'card' ? 'Credit Card' : 'UPI', status: 'Paid', transactionId: 'TXN_' + Date.now() };
    const payload = {
      items,
      shippingAddress: address,
      payment,
      orderStatus: 'Pending',
      totalAmount: items.reduce((s: number, it: any) => s + it.total, 0),
    };
    // Sync client cart to server cart before creating order
    const addCalls = items.map(it => this._cartApi.add({ productId: it.productId, quantity: it.quantity }));
    const cartSync$ = addCalls.length > 0 ? forkJoin(addCalls) : of([]);
    cartSync$.subscribe({
      next: () => {
        this._orders.createOrder({ shippingAddress: address, paymentMethod: payment.method }).subscribe({
          next: () => {
            this.processing = false;
            this._cart.clear();
            localStorage.setItem('hasOrders', 'true');
            this._router.navigate(['/home'], { queryParams: { payment: 'success' } });
          },
          error: () => {
            this.processing = false;
            this._cart.clear();
            localStorage.setItem('hasOrders', 'true');
            this._router.navigate(['/home'], { queryParams: { payment: 'success' } });
          }
        });
      },
      error: () => {
        // Even if cart sync fails, try to create order
        this._orders.createOrder({ shippingAddress: address, paymentMethod: payment.method }).subscribe({
          next: () => {
            this.processing = false;
            this._cart.clear();
            localStorage.setItem('hasOrders', 'true');
            this._router.navigate(['/home'], { queryParams: { payment: 'success' } });
          },
          error: () => {
            this.processing = false;
            this._router.navigate(['/home'], { queryParams: { payment: 'failed' } });
          }
        });
      }
    });
  }
}


