import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { LoggingService } from './../../core/logging/logging.service';
import { BannerModel } from './banner.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class BannerService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getAll(): Observable<BannerModel[]> {
    try {
      return this.http.get(`${environment.API}api/BannerMain`)
        .map((res: Response) => {
          return res.json().map((banner: any) => new BannerModel().deserialize(banner));
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));

    } catch (error) {
      this.logService.error('BannerService.getAll - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  get(bannerId: number): Observable<BannerModel> {
    try {
      return this.http.get(`${environment.API}api/BannerMain/${bannerId}`)
      .map((res: Response) => {
        return new BannerModel().deserialize(res.json());
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));

  } catch (error) {
    this.logService.error('BannerService.getAll - Unexpected Error', error);
    return Observable.throw('ErrUnexpected');
  }
  }

  update(entity: any[]): Observable<void> {
    try {
      return this.http.post(`${environment.API}api/BannerMain`, JSON.stringify(entity))
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('BannerService.update - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  add(entity: BannerModel): Observable<boolean> {
    try {
      return this.http.post(`${environment.API}api/BannerMain/add`, JSON.stringify(entity))
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('BannerService.add - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  edit(entity: BannerModel): Observable<boolean> {
    try {
      return this.http.post(`${environment.API}api/BannerMain/edit`, JSON.stringify(entity))
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('BannerService.edit - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  delete(bannerId: number): Observable<boolean> {
    try {
      return this.http.delete(`${environment.API}api/BannerMain/${bannerId}`)
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('BannerService.delete - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

}
