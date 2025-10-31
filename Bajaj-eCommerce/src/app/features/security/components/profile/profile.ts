import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityApi } from '../../services/security-api';

@Component({
  selector: 'bajaj-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private _security = inject(SecurityApi);
  protected user: any;
  protected displayAddress = '';

  ngOnInit(): void {
    this._security.me().subscribe({
      next: (res:any) => {
        this.user = res?.user || res;
        this.displayAddress = this.formatDefaultAddress(this.user);
      },
      error: () => {
        // Fallback to localStorage when /auth/me isn't available
        this.user = {
          name: localStorage.getItem('name') || '',
          email: localStorage.getItem('email') || '',
          addresses: [],
        };
        this.displayAddress = '';
      },
    });
  }

  private formatDefaultAddress(u: any): string {
    const addr = Array.isArray(u?.addresses) ? (u.addresses.find((ad:any)=>ad?.isDefault) || u.addresses[0]) : null;
    if (!addr) return '';
    const parts = [addr.label, addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean);
    return parts.join(', ');
  }
}


