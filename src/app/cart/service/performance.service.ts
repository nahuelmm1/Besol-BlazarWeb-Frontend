import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { LoggingService } from '../../core/logging/logging.service';
import { GroupModel } from '../model/Group.model';
import { PerformanceStatsModel } from '../model/performance-stats.model';

@Injectable()
export class PerformanceService {

  constructor(private http: Http,
              private logService: LoggingService) {}


  getGroups(): Observable<Array<GroupModel>> {
    try {
      return this.http.get(`${environment.API}api/performance/group`)
                  .map((res: Response) => {
                    return res.json().map((brand: any) => new GroupModel().deserialize(brand));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('PerformanceService.getGroups - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getStats(statsFilter: any): Observable<Array<PerformanceStatsModel>> {
    try {
      return this.http.post(`${environment.API}api/performance/stats`, JSON.stringify(statsFilter))
                  .map((res: Response) => {
                    return res.json().map((stats: any) => new PerformanceStatsModel().deserialize(stats));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('PerformanceService.getStats - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
