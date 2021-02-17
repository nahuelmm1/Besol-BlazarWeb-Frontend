import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { PagedData } from '../../shared/models/page-data.model';
import { Page } from '../../shared/models/page.model';
import { LoggingService } from '../../core/logging/logging.service';
import { PurchaseOrderItem } from '../model/purchase-order-item.model';
import { ProductsPurchaseOrderItem } from '../model/products-purchase-order-item.model';

@Injectable()
export class PurchaseOrderService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getPurchaseOrders(page: Page): Observable<PagedData<PurchaseOrderItem>> {
    try {

      const requestParams = {
        brand: page.filters.brandId === -1 ? 0 : page.filters.brandId,
        store: page.filters.storeIds === -1 ? 0 : page.filters.storeIds,
        delivered: page.filters.pendingDelivery === true ? 'N' : '0',
        limit: page.size,
        page: page.pageNumber + 1,
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection
      };

      return this.http.get(`${environment.API}api/purchaseOrder`, { params: requestParams })
                      .map((res: Response) => {
                        const pagedData = new PagedData<PurchaseOrderItem>();
                        page.totalElements = res.json().total;
                        page.totalPages = page.totalElements / page.size;
                        pagedData.data = res.json().items.map((item: any) => {
                          return new PurchaseOrderItem().deserialize(item);
                        });
                        pagedData.page = page;
                        return pagedData;
                      })
                      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('PurchaseOrderService.getPurchaseOrders - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getProductsForPurchaseOrder(page: Page): Observable<PagedData<ProductsPurchaseOrderItem>> {
    try {
      const requestParams = {
        brand: page.filters.brandId === -1 ? 0 : page.filters.brandId,
        store: page.filters.storeIds === -1 ? 0 : page.filters.storeIds,
        dateFrom: page.filters.dateFrom === undefined ? null : page.filters.dateFrom ,
        dateUntil: page.filters.dateUntil === undefined ? null : page.filters.dateUntil
      };

      return this.http.get(`${environment.API}api/purchaseOrder/products`, { params: requestParams })
                      .map((res: Response) => {
                        const pagedData = new PagedData<PurchaseOrderItem>();
                        page.totalElements = res.json().total;
                        page.totalPages = 1;
                        page.size = page.totalElements;
                        pagedData.data = res.json().items.map((item: any) => {
                          return new ProductsPurchaseOrderItem().deserialize(item);
                        });
                        pagedData.page = page;
                        return pagedData;
                      })
                      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('PurchaseOrderService.getProductsForPurchaseOrder - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  savePurchaseOrders(brand: number, products: ProductsPurchaseOrderItem[]): any {
    const args = {
      brandId: brand
    };
    try {
      return this.http.post(`${environment.API}api/purchaseOrder`, products, {params: args})
                      .catch((err: any) =>
                        this.logService.handleHttpResponseError(err)
                      );
    } catch (error) {
      this.logService.error('PurchaseOrderService.savePurchaseOrders - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  notifySupplier(brand: number, message: string, storesId): Observable<Response> {
    try {
      const requestParams = {
        brandId: brand,
        message: message,
        storesId: storesId
      };
      return this.http.get(`${environment.API}api/purchaseOrder/notification`, { params: requestParams })
                      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('PurchaseOrderService.notifySupplier - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

}
