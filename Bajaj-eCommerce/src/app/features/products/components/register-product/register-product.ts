import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsApi } from '../../services/products-api'; 
import { ToastService } from '../../../../shared/services/toast.service'; 

@Component({
  selector: 'bajaj-register-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-product.html',
  styleUrls: ['./register-product.css']
})
export class RegisterProduct implements OnInit {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _productsApi = inject(ProductsApi);
  private _toast = inject(ToastService);

  protected form: FormGroup;
  protected isAdmin = false;

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';

    this.form = this._fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      brand: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      color: [''],
      material: [''],
      warranty: [''],
      images: [''] // comma-separated URLs
    });
  }

  protected onSubmit(): void {
    if (!this.isAdmin || this.form.invalid) return;

    const value = this.form.value;
    const payload = {
      name: value.name,
      sku: value.sku,
      brand: value.brand,
      categoryId: value.categoryId,
      price: value.price,
      discount: value.discount,
      stock: value.stock,
      description: value.description,
      attributes: {
        color: value.color,
        material: value.material,
        warranty: value.warranty
      },
      images: value.images ? value.images.split(',').map((url: string) => url.trim()) : []
    };

    this._productsApi.createProduct(payload).subscribe({
      next: () => {
        this._toast.show('Product registered successfully', 'success');
        this.form.reset();
      },
      error: (err) => {
        console.error('Product registration failed', err);
        this._toast.show('Failed to register product', 'danger');
      }
    });
  }
}
