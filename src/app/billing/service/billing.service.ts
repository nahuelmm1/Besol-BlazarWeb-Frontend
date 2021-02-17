import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { BillingReceiptListItem } from '../model/billing-receipt-list.model';
import { PagedData } from '../../shared/models/page-data.model';
import { Page } from '../../shared/models/page.model';

import { LoggingService } from '../../core/logging/logging.service';
import { ReceiptModel } from '../model/billing-receipt.model';

@Injectable()
export class BillingService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getReceiptReport(page: Page): Observable<PagedData<BillingReceiptListItem>> {
    try {
      const params = {
        limit: page.size,
        page: page.pageNumber + 1,
        pointOfSaleId: page.filters.pointOfSaleId,
        from: page.filters.from,                    // "YYYY-MM-DDT00:00:00",
        to: page.filters.to,                         // "2017-01-05T00:00:00",
        receiptId: page.filters.vaucherNumber,
        client: page.filters.userName,
        seller: page.filters.sellerName,
        amountFrom: page.filters.amountFrom,
        amountTo: page.filters.amountTo,
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection
      };

        return this.http.post(`${environment.API}api/receipt/report`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<BillingReceiptListItem>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new BillingReceiptListItem().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('BillingService.getReceiptReport - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  getReceipt(id: number): Observable<ReceiptModel> {
    try {
        return this.http.get(`${environment.API}api/receipt/${id}`)
        .map((res: Response) => {
          const receipt = new ReceiptModel();
          receipt.deserialize(res.json());
          return receipt;
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('BillingService.getReceipt - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  createReceipt(receipt: ReceiptModel): Observable<number> {
    try {
      return this.http.post(`${environment.API}api/receipt/create`, JSON.stringify(receipt))
        .map((res: Response) => {
          return res.json();
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('BillingService.createReceipt - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateReceipt(receipt: ReceiptModel): Observable<number> {
    try {
      return this.http.post(`${environment.API}api/receipt/update`, JSON.stringify(receipt))
        .map((res: Response) => {
          return res.json();
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('BillingService.createReceipt - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  downloadReceipt(receiptId: number): Observable<number> {
    const args: RequestOptionsArgs = {
      responseType: ResponseContentType.Blob
    };
    try {
      return this.http.post(
          `${environment.API}api/receipt/export`,
          JSON.stringify({ receiptId}),
          args)
          .map (
            (response) => {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(response.blob());
              link.download = `Receipt_${receiptId}.pdf`;
              link.click();
              return 1;
            })
          .catch(
            (err: any) => this.logService.handleHttpResponseError(err)
          );
    } catch (error) {
      this.logService.error('BillingService.downloadReceipt - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  deleteReceipt(receiptId: number): Observable<number> {
    try {
      return this.http.delete(
          `${environment.API}api/receipt/${receiptId}`)
          .catch(
            (err: any) => this.logService.handleHttpResponseError(err)
          );
    } catch (error) {
      this.logService.error('BillingService.deleteReceipt - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
