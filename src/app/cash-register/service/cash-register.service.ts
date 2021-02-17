import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { CashRegisterListItem } from '../model/cash-register-list.model';
import { CashRegisterCheckerListItem } from '../model/cash-register-cheker-list-item.model';
import { PagedData } from '../../shared/models/page-data.model';
import { Page } from '../../shared/models/page.model';
import { CashRegisterModel } from '../model/cash-register-action.model';
import { CashRegisterStateModel } from '../model/cash-register-state.model';

import { LoggingService } from '../../core/logging/logging.service';

@Injectable()
export class CashRegisterService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getCashRegisterReport(page: Page): Observable<PagedData<CashRegisterListItem>> {
     try {
        const params = {
          limit: page.size,
          page: page.pageNumber + 1,
          pointOfSaleId: page.filters.pointOfSaleId,
          from: page.filters.from,                    // "YYYY-MM-DDT00:00:00",
          to: page.filters.to,                         // "2017-01-05T00:00:00",
          verified: page.filters.verified
        };

        // console.log(params);
        return this.http.post(`${environment.API}api/cashregister/report`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CashRegisterListItem>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((cri: any) => {
                      return new CashRegisterListItem().deserialize(cri);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CashRegisterService.getCashRegisterReport - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  openCashRegister(cashRegister: CashRegisterModel): Observable<number> {
    try {
        return this.http.post(`${environment.API}api/cashregister/open`, JSON.stringify(cashRegister))
                  .map(res => res.json())
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CashRegisterService.openCashRegister - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  closeCashRegister(cashRegister: CashRegisterModel): Observable<number> {
    try {
        return this.http.post(`${environment.API}api/cashregister/close`, JSON.stringify(cashRegister))
                  .map(res => res.json())
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CashRegisterService.closeCashRegister - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCashRegisterDetail(page: Page): Observable<any> {
    try {
        const params = {
          limit: page.size,
          page: page.pageNumber + 1,
          cashRegisterId: page.filters.cashRegisterId,
          pointOfSaleId: page.filters.pointOfSaleId,
        };

        return this.http.post(`${environment.API}api/cashregister/details`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CashRegisterListItem>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((cri: any) => {
                      return new CashRegisterListItem().deserialize(cri);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CashRegisterService.getCashRegisterDetail - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCashRegisterCheckerList(page: Page): Observable<PagedData<CashRegisterCheckerListItem>> {
     try {
        const params = {
          limit: page.size,
          page: page.pageNumber + 1,
          pointOfSaleId: page.filters.pointOfSaleId,
          from: page.filters.from,
          to: page.filters.to
        };

        return this.http.post(`${environment.API}api/cashregister/checker/list`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CashRegisterCheckerListItem>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((cri: any) => {
                      return new CashRegisterCheckerListItem().deserialize(cri);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CashRegisterService.getCashRegisterCheckerList - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  verifyCashRegister(cashRegister: CashRegisterModel): Observable<number> {
    try {
        return this.http.post(`${environment.API}api/cashregister/verify`, JSON.stringify(cashRegister))
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CashRegisterService.verifyCashRegister - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCashRegister(cashRegisterId: number): Observable<any> {
    try {
        return this.http.get(`${environment.API}api/cashregister/${cashRegisterId}`)
                        .map((res: Response) => {
                          const cashRegister = new CashRegisterModel();
                          cashRegister.deserialize(res.json());
                          return cashRegister;
                      })
                      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CashRegisterService.getCashRegister - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateCashRegister(cashRegister: CashRegisterModel): Observable<number> {
    try {
        return this.http.post(`${environment.API}api/cashregister/update`, JSON.stringify(cashRegister))
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CashRegisterService.updateCashRegister - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCashRegisterState(pointOfSaleId: number): Observable<any> {
    try {
        return this.http.get(`${environment.API}api/cashregister/state/${pointOfSaleId}`)
                        .map((res: Response) => {
                          const state = new CashRegisterStateModel();
                          state.deserialize(res.json());
                          return state;
                      })
                      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CashRegisterService.getCashRegisterState - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
