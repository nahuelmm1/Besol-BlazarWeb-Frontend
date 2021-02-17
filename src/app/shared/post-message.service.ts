import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostMessageService {
  private messages: Observable<any> = Observable.fromEvent(window, 'message');

  send(target, type, payload): void {
    target.postMessage({
      type,
      payload
    }, location.origin);
  }

  subscribe(type, next, error?): Subscription {
    return this.messages
      .filter((event) => event.origin === location.origin)
      .filter((event) => event.data.type === type)
      .map((event) => event.data.payload)
      .subscribe(next, error);
  }
}
