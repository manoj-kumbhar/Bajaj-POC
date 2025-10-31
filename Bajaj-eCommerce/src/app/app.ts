import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';

import { NavBar } from './shared/components/nav-bar/nav-bar';
import { Footer } from './shared/components/footer/footer';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { Toasts } from './shared/components/toasts/toasts';
import { ToastService } from './shared/services/toast.service';

@Component({
  selector: 'bajaj-root',
  imports: [NavBar, Footer, Sidebar, RouterOutlet, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bajaj-ecommerce-app');
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _toast = inject(ToastService);

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const payment = params['payment'];
      if (payment === 'success') {
        this._toast.show('Order placed successfully', 'success', 2000);
        this._router.navigate([], { queryParams: { payment: null }, queryParamsHandling: 'merge' });
      } else if (payment === 'failed') {
        this._toast.show('Order could not be placed', 'danger', 2000);
        this._router.navigate([], { queryParams: { payment: null }, queryParamsHandling: 'merge' });
      }
    });
  }
}
