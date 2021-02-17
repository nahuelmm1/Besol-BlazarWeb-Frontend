import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { LoggingService } from '../../core/logging/logging.service';
import { ParameterModel } from './model/parameter.model';

@Injectable()
export class ParameterService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getAll(): Observable<Array<ParameterModel>> {
    try {
      return this.http.get(`${environment.API}api/AppSetting`)
        .map((res: Response) => {
          return res.json().map((appSetting: any) => new ParameterModel().deserialize(appSetting));
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));

    } catch (error) {
      this.logService.error('ParameterService.getAll - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  update(entity: Array<ParameterModel>): Observable<void> {
    try {
      return this.http.post(`${environment.API}api/AppSetting`, JSON.stringify(entity))
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('ParameterService.update - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
