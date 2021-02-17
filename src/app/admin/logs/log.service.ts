import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { LoggingService } from '../../core/logging/logging.service';

import { Log } from './log.model';
import { PagedData } from '../../shared/models/page-data.model';
import { Page } from '../../shared/models/page.model';

@Injectable()
export class LogService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getLogs(page: Page): Observable<PagedData<Log>> {
    try {
      const params = {
        filters: page.filters,
        filter: page.filter,
        limit: page.size,
        order: page.order,
        page: page.pageNumber + 1
      };

      return this.http.post(`${environment.API}api/log/logs`, JSON.stringify(params))
                .map((res: Response) => {
                  const pagedData = new PagedData<Log>();
                  page.totalElements = res.json().total;
                  page.totalPages = page.totalElements / page.size;
                  pagedData.data = res.json().logList.map((log: any) => {
                    return new Log().deserialize(log);
                  });
                  pagedData.page = page;
                  return pagedData;
                })
                .catch((err: any) => this.logService.handleHttpResponseError(err));

    } catch (error) {
      this.logService.error('LogService.getLogs - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  cleanLogs(): Observable<boolean> {
    try {
      return this.http.delete(`${environment.API}api/log/cleanLogs`)
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('LogService.cleanLogs - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

}
