import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';
import { Observable } from 'rxjs/Observable';
import { ClientStatsModel } from './client-stats.model';
import { environment } from '../../../environments/environment';
import { Http, Response  } from '@angular/http';
import { LoggingService } from '../../core/logging/logging.service';
import { ClientStatsPaymentModel } from './client-stats-payment.model';
import { ClientStatsCartModel } from './client-stats-cart.model';

@Injectable()
export class ClientStatsService {

  constructor(
    private http: Http,
    private logService: LoggingService,
    private translate: TranslateService
  ) { }

  getClient(id: number): Observable<ClientStatsModel> {
    try {
      return this.http.get(`${environment.API}api/client/${id}`)
                  .map((res: Response) => {
                    return new ClientStatsModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('ClientStatsService.getClient - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  getPayments(id): Observable<Array<ClientStatsPaymentModel>> {
    try {
      return this.http.get(`${environment.API}api/client/${id}/payments`)
                  .map((res: Response) => {
                    return res.json().map((payment: any) => new ClientStatsPaymentModel().deserialize(payment));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('ClientStatsService.getPayments - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCarts(id): Observable<Array<ClientStatsCartModel>> {
    try {
      return this.http.get(`${environment.API}api/client/${id}/carts`)
                  .map((res: Response) => {
                    return res.json().map((carts: any) => new ClientStatsCartModel().deserialize(carts));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('ClientStatsService.getCarts - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
