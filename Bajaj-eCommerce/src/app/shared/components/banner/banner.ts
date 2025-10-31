import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bajaj-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner implements OnInit {
  protected loading = false;

  protected bannerItems = [
   
    {
      title: 'Fast & Free Delivery',
      subtitle: 'On all orders above ₹499.',
    },
    {
      title: 'Secure Payments',
      subtitle: 'Shop with confidence and ease.',
    },
    {
      title: '24/7 Customer Support',
      subtitle: 'We’re here whenever you need us.',
    },
  ];

  ngOnInit(): void {
    // No data fetching needed for static banner
  }
}
