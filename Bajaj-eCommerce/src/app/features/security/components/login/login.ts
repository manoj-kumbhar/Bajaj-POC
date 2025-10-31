// src/app/features/auth/components/login.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthRequest } from '../../models/auth-request';
import { AuthResponse } from '../../models/auth-response';
import { SecurityApi } from '../../services/security-api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  private _securityApi = inject(SecurityApi);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  protected form: FormGroup = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  protected authResponse?: AuthResponse;
  protected authErrorMessage: string = '';
  private _returnUrl?: string;

  ngOnInit(): void {
    this._returnUrl = this._activatedRoute.snapshot.queryParams['returnurl'];
  }

  protected onCredentialSubmit(): void {
    if (this.form.invalid) {
      this.authErrorMessage = 'Please provide credentials.';
      setTimeout(() => (this.authErrorMessage = ''), 4000);
      return;
    }
    const user = this.form.value as AuthRequest;
    this._securityApi.authenticateCredential(user).subscribe({
      next: (response: AuthResponse) => {
        if (response && response.token) {
          this._router.navigate([this._returnUrl || '/home']);
        } else {
          this.authErrorMessage = response?.message ?? 'Login failed.';
          setTimeout(() => {
            this.authErrorMessage = '';
          }, 5000);
        }
      },
      error: (err: unknown) => {
        console.error('Authentication error', err);
        this.authErrorMessage = 'An error occurred while trying to login. Please try again later.';
        setTimeout(() => {
          this.authErrorMessage = '';
        }, 5000);
      },
    });
  }
}
