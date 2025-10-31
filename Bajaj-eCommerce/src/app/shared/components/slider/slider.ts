import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bajaj-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.html',
  styleUrl: './slider.css',
})
export class Slider implements OnInit, OnDestroy {
  protected slides = [
    { title: 'Welcome to Bajaj E-Commerce', subtitle: 'Your one-stop shop for everything!' },
    { title: 'Exclusive Deals', subtitle: 'Grab the best offers before they’re gone.' },
    { title: 'Fast & Free Delivery', subtitle: 'On all orders above ₹499.' },
    { title: 'Secure Payments', subtitle: 'Shop with confidence and ease.' },
    { title: '24/7 Customer Support', subtitle: 'We’re here whenever you need us.' }
  ];

  protected currentIndex = 2;
  protected autoSlideInterval: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  protected goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  protected nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.resetAutoSlide();
  }

  protected prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.resetAutoSlide();
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 500000);
  }

  private resetAutoSlide(): void {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
  }
}
