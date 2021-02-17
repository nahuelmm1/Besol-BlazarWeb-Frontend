import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { CartSelectorModalComponent } from './cart-selector-modal.component';
import { TranslateService } from '../../core/translate/translate.service';
import { Page } from '../models/page.model';
import { Observable } from 'rxjs/Observable';
import { PagedData } from '../models/page-data.model';
import { CartSelectorModel } from './cart-selector.model';
import { environment } from '../../../environments/environment';
import { Http, Response  } from '@angular/http';
import { LoggingService } from '../../core/logging/logging.service';

@Injectable()
export class CartSelectorService {

  constructor(private dialogRef: MdDialog,
    private http: Http,
    private logService: LoggingService,
    private translate: TranslateService
  ) { }

  select({ multipleSelection = false, filter = {} }: any) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '90%';

    const dialogRef = this.dialogRef.open(CartSelectorModalComponent, config);
    dialogRef.componentInstance.multipleSelection = multipleSelection;
    dialogRef.componentInstance.filter = filter;
    return dialogRef.afterClosed();
  }

  getCarts(page: Page): Observable<PagedData<CartSelectorModel>> {
    try {
      const params = {
        limit: page.size,
        page: page.pageNumber + 1,
        from: page.filters.from,                    // "YYYY-MM-DDT00:00:00",
        to: page.filters.to,                         // "2017-01-05T00:00:00",
        cartId: page.filters.cartNumber,
        name: page.filters.name,
        lastname: page.filters.lastname,
        user: page.filters.user,
        province: page.filters.province,
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection
      };

        return this.http.post(`${environment.API}api/cart/list`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CartSelectorModel>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new CartSelectorModel().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CartSelectorService.getCarts - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }
}
