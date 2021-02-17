import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Http, Response  } from '@angular/http';
import { LoggingService } from '../../core/logging/logging.service';
import { ReassignCartModel } from './reassign-cart.model';

@Injectable()
export class ReassignCartService {

  constructor(
    private http: Http,
    private logService: LoggingService,
    private translate: TranslateService
  ) { }

  getReassignData(cartNumber: number): Observable<ReassignCartModel> {
    try {
      return this.http.get(`${environment.API}api/cart/reassign/${cartNumber}`)
                  .map((res: Response) => {
                    return new ReassignCartModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('ReassignCartService.getReassignData - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  reassign(cartNumber: number, userId: number): Observable<any> {
    try {
      const data = {
        cartNumber,
        userId
      };
      return this.http.post(`${environment.API}api/cart/reassign`, data)
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('ReassignCartService.reassign - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }
}
