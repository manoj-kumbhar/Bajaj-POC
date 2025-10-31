import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  timeoutMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  public messages$ = new Subject<ToastMessage>();

  show(text: string, type: ToastMessage['type'] = 'info', timeoutMs = 2000) {
    this.messages$.next({ text, type, timeoutMs });
  }
}


