import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersApi } from '../../services/orders-api';
import { Order } from '../../models/order';

@Component({
  selector: 'bajaj-orders-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-list.html',
  styleUrls: ['./orders-list.css']
})
export class OrdersList implements OnInit {
  private _orders = inject(OrdersApi);
  protected orders: Order[] = [];

  ngOnInit(): void {
    this._orders.getMyOrders().subscribe({
      next: (res: any) => {
        const data = res?.orders || res?.data || res || [];
        this.orders = (Array.isArray(data) ? data : []) as Order[];
      },
      error: () => {
        this.orders = [];
      }
    });
  }
}


