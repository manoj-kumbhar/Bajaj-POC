import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { ToastMessage, ToastService } from '../../services/toast.service';

@Component({
  selector: 'bajaj-toasts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toasts.html',
  styleUrls: ['./toasts.css']
})
export class Toasts implements OnInit, OnDestroy {
  private _subs = new Subscription();
  private _toast = inject(ToastService);
  protected list: ToastMessage[] = [];

  ngOnInit(): void {
    this._subs.add(
      this._toast.messages$.subscribe(m => {
        this.list.push(m);
        const idx = this.list.length - 1;
        const ms = m.timeoutMs ?? 3000;
        this._subs.add(timer(ms).subscribe(() => this.list.splice(idx, 1)));
      })
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}


