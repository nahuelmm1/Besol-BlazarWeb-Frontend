import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

import { PointOfSaleModel } from './models/point-of-sale.model';
import { LoggingService } from '../core/logging/logging.service';
import { PointOfSaleDialogueService } from './point-of-sale-dialogue/point-of-sale-dialogue-service';

@Injectable()
export class PointOfSaleService {

  private static instancePointOfSale: PointOfSaleModel = null;

  private static getCachedPointOfSale(): PointOfSaleModel {
    return PointOfSaleService.instancePointOfSale;
  }

  private static getLocalStoragePointOfSale(): PointOfSaleModel {
    try {
      return JSON.parse(localStorage.getItem('PointOfSale'));
    } catch (error) {
      return null;
    }
  }

  private static setCachedPointOfSale(pos: PointOfSaleModel) {
    PointOfSaleService.instancePointOfSale = pos;
    localStorage.setItem('PointOfSale', JSON.stringify(pos));
  }

  constructor(private http: Http,
              private pointOfSaleDialogService: PointOfSaleDialogueService,
              private logService: LoggingService) {}

  getPointOfSale(): Observable<any> {
    try {
      const cachedPos = PointOfSaleService.getCachedPointOfSale();
      if (cachedPos) {
        return Observable.of(cachedPos);
      }
      return this.http
        .get(`${environment.API}api/pointofsale/bymachine`)
          .map((res: Response) => {
            const pos = new PointOfSaleModel().deserialize(res.json());
            PointOfSaleService.setCachedPointOfSale(pos);
            return pos;
          })
          .catch((err: any) => {

            // try get from local storage
            const localStoragePos = PointOfSaleService.getLocalStoragePointOfSale();
            if (localStoragePos) {
              PointOfSaleService.setCachedPointOfSale(localStoragePos);
              return Observable.of(localStoragePos);
            }

            // pront user selection
            const pointsOfSale = this.getPointsOfSale();

            return this.pointOfSaleDialogService.selectPointOfSale(pointsOfSale).map(result => {
              if (result && result.doAction) {
              PointOfSaleService.setCachedPointOfSale(result.pointOfSale);
              return result.pointOfSale;
              }
              return this.logService.handleHttpResponseError(err);
            });
          });
    } catch (error) {
      this.logService.error('PointOfSaleService.getPointOfSale - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getPointsOfSale(pointOfSale?: number): Observable<Array<PointOfSaleModel>> {
    try {
      const posRouteParam = (pointOfSale == null) ? '' : `/${pointOfSale}`;

      return this.http.get(`${environment.API}api/pointofsale${posRouteParam}`)
                  .map((res: Response) => {
                      if (pointOfSale == null) {
                        return res.json().map((pos: any) => new PointOfSaleModel().deserialize(pos));
                      } else {
                        return new Array<PointOfSaleModel>(new PointOfSaleModel().deserialize(res.json()));
                      }
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('PointOfSaleService.getPointsOfSale - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getAll(): Observable<Array<PointOfSaleModel>> {
    try {
      return this.http.get(`${environment.API}api/pointofsale/all`)
                  .map((res: Response) => {
                        return res.json().map((pos: any) => new PointOfSaleModel().deserialize(pos));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('PointOfSaleService.getAll - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
