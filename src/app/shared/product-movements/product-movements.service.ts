import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Http, Response  } from '@angular/http';
import { LoggingService } from '../../core/logging/logging.service';
import { ProductMovememntModel } from './product-movement.model';

@Injectable()
export class ProductMovementsService {

  constructor(
    private http: Http,
    private logService: LoggingService,
    private translate: TranslateService
  ) { }

  getMovements(id: number): Observable<Array<ProductMovememntModel>> {
    try {
      return this.http.get(`${environment.API}api/product/movements/${id}`)
                  .map((res: Response) => {
                    return res.json().map((move: any) => new ProductMovememntModel().deserialize(move));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('ProductMovementsService.getMovements - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  // getPayments(id): Observable<Array<ClientStatsPaymentModel>> {
  //   try {
  //     return this.http.get(`${environment.API}api/client/${id}/payments`)
  //                 .map((res: Response) => {
  //                   return res.json().map((payment: any) => new ClientStatsPaymentModel().deserialize(payment));
  //                 })
  //                 .catch((err: any) => this.logService.handleHttpResponseError(err));
  //   } catch (error) {
  //     this.logService.error('ClientStatsService.getPayments - Unexpected Error', error);
  //     return Observable.throw('ErrUnexpected');
  //   }
  // }

  // getCarts(id): Observable<Array<ClientStatsCartModel>> {
  //   try {
  //     return this.http.get(`${environment.API}api/client/${id}/carts`)
  //                 .map((res: Response) => {
  //                   return res.json().map((carts: any) => new ClientStatsCartModel().deserialize(carts));
  //                 })
  //                 .catch((err: any) => this.logService.handleHttpResponseError(err));
  //   } catch (error) {
  //     this.logService.error('ClientStatsService.getCarts - Unexpected Error', error);
  //     return Observable.throw('ErrUnexpected');
  //   }
  // }
}
