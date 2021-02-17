import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PageLoaderService {
  private pageLoadingSource = new Subject<boolean>();
  pageLoading$ = this.pageLoadingSource.asObservable();

  setPageLoadingStatus(isLoading: boolean): void {
    this.pageLoadingSource.next(isLoading);
  }
}
