import { Component, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'bajaj-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private _platformId = inject(PLATFORM_ID);
  protected isCollapsed = false;
  protected windowRef: Window | undefined;
  protected isDesktop = true;
  protected get showOrders(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('hasOrders');
  }
  protected get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this.windowRef = window;
      this.checkScreenSize();
      window.addEventListener('resize', () => this.checkScreenSize());
      window.addEventListener('toggleSidebar', () => this.toggleSidebar());
      
      // Close sidebar when clicking outside on mobile
      document.addEventListener('click', (event) => this.handleOutsideClick(event));
    }
  }

  private handleOutsideClick(event: Event): void {
    if (!this.isDesktop && !this.isCollapsed) {
      const target = event.target as HTMLElement;
      const sidebar = document.querySelector('.sidebar');
      const sidebarToggle = document.querySelector('.sidebar-toggle-btn');
      
      // Check if click is outside sidebar and not on the toggle button
      if (sidebar && !sidebar.contains(target) && !sidebarToggle?.contains(target)) {
        this.isCollapsed = true;
      }
    }
  }

  private checkScreenSize(): void {
    if (this.windowRef) {
      this.isDesktop = this.windowRef.innerWidth > 800;
      if (this.isDesktop) {
        this.isCollapsed = false; // Always open on desktop (above 800px)
      } else {
        this.isCollapsed = true; // Always collapsed on mobile (800px and below)
      }
    }
  }

  protected toggleSidebar(): void {
    if (!this.isDesktop) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  protected onNavClick(): void {
    // Close sidebar when clicking a navigation link on mobile
    if (!this.isDesktop) {
      this.isCollapsed = true;
    }
  }
}
