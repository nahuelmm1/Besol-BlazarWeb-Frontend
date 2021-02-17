import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { LoggingService } from '../../core/logging/logging.service';
import { OperationResponseModel } from './model/operation-response.model';
import { OperationGroupModel } from './model/operation-group.model';

@Injectable()
export class OperationService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getOperations(): Observable<OperationResponseModel> {
    try {
      return this.http.get(`${environment.API}api/operation/all`)
                .map((res: Response) => {
                  return new OperationResponseModel().deserialize(res.json());
                })
                .catch((err: any) => this.logService.handleHttpResponseError(err));

    } catch (error) {
      this.logService.error('OperationService.getOperations - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateOperations(operationGroups: Array<OperationGroupModel>): Observable<Array<OperationGroupModel>> {
    try {
      return this.http.post(`${environment.API}api/operation/operationGroup`, { operationGroups })
                .map((res: Response) => {
                  return res.json().map((operationGroup) => new OperationGroupModel().deserialize(operationGroup));
                })
                .catch((err: any) => this.logService.handleHttpResponseError(err));

    } catch (error) {
      this.logService.error('OperationService.updateOperations - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
