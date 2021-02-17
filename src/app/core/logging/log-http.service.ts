import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { LoggingService } from './logging.service';
import { LocalStorageService } from '../../shared/local-storage.service';

import { Observable } from 'rxjs/Observable';
import { noop } from 'rxjs/util/noop';

import { environment } from '../../../environments/environment';
import { LogLevel } from './log-level.enum';
import { Log } from './log.model';

@Injectable()
export class LoggingHttpService {

  constructor(private loggingService: LoggingService,
              private localStorage: LocalStorageService,
              private http: Http) {
    this.subscribeToLoggingService();
  }

  init(): void {
    // Initialize service for IOC ctor
    // console.log('LoggingHttpService is initialized');
  }

  // try to log the error to the server side.
  sendToServer(log: Log): void {
    // get ell Logs before to try resend
    // console.log('before', this.localStorage.getLogs());
    let logs = this.getLocalUnsentLogs(log);
    // console.log(logs);

    try {
      this.http.post(`${environment.API}api/log/log`, JSON.stringify(logs))
                  .subscribe(
                     () => noop(),
                     (err: any) => {
                       // console.warn('POST - Error server-side logging failed', err);
                       this.localStorage.addLogs(logs);
                     }
                  );
    } catch (loggingError) {
      // Defensive. If unhandled error in logger, then die silently
      // console.warn('SendToServer - Error server-side logging failed', loggingError);
      this.localStorage.addLogs(logs);
    }
    // console.log('after', this.localStorage.getLogs());
  }

  private subscribeToLoggingService(): void {
    this.loggingService.logData$.subscribe(
      (log: Log) => {
        this.sendToServer(log);
      });
  }

  private getLocalUnsentLogs(currentLog: Log): Array<Log> {
    let logs = this.localStorage.getLogs(); // .orderby..splice(0, 10) //Take current and last x order by most recent
    if (logs.length > 0) {
      this.localStorage.purgeLogs();
    }
    logs.push(currentLog);
    return logs;
  }
}
