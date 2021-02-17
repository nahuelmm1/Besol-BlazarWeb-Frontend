import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { LoggingService } from '../../core/logging/logging.service';
import { NewModel } from './new.model';

@Injectable()
export class NewService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getAll(): Observable<NewModel[]> {
    try {
      return this.http.get(`${environment.API}api/New`)
        .map((res: Response) => {
          return res.json().map((_new: any) => new NewModel().deserialize(_new));
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));

    } catch (error) {
      this.logService.error('NewService.getAll - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  add(entity: NewModel): Observable<boolean> {
    try {
      return this.http.post(`${environment.API}api/New/add`, JSON.stringify(entity))
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('NewService.add - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  edit(entity: NewModel): Observable<boolean> {
    try {
      return this.http.post(`${environment.API}api/New/edit`, JSON.stringify(entity))
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('NewService.edit - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  delete(newId: number): Observable<boolean> {
    try {
      return this.http.delete(`${environment.API}api/New/${newId}`)
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('NewService.delete - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

}
