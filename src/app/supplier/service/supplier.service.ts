import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { LoggingService } from '../../core/logging/logging.service';
import { AvailabilityModel } from '../model/availability.model';

@Injectable()
export class SupplierService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getAvailability(year: number, month: number): Observable<Array<AvailabilityModel>> {
    try {
      return this.http.get(`${environment.API}api/supplier/availability/${year}/${month}`)
                  .map((res: Response) => {
                    return res.json().map((availability: any) => new AvailabilityModel().deserialize(availability));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('SupplierService.getAvailability - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateAvailability(entity: any): Observable<AvailabilityModel> {
    try {
      entity.start = moment(entity.start).format();
      entity.end = moment(entity.end).format();
      return this.http.post(`${environment.API}api/supplier/availability/${entity.id}/update`, JSON.stringify(entity))
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('SupplierService.updateAvailability - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  createAvailability(entity: any): Observable<AvailabilityModel> {
    try {
      entity.start = moment(entity.start).format();
      entity.end = moment(entity.end).format();
      return this.http.post(`${environment.API}api/supplier/availability`, JSON.stringify(entity))
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('SupplierService.createAvailability - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  deleteAvailability(entity: any): Observable<Array<AvailabilityModel>> {
    try {
      return this.http.post(`${environment.API}api/supplier/availability/${entity.id}/delete`, {})
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('SupplierService.deleteAvailability - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  generateAvailability(entity: any): Observable<any> {
    try {
      entity.dateStart = moment(entity.dateStart).format();
      entity.dateEnd = moment(entity.dateEnd).format();
      return this.http.post(`${environment.API}api/supplier/availability/generate`, JSON.stringify(entity))
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('SupplierService.generateAvailability - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
