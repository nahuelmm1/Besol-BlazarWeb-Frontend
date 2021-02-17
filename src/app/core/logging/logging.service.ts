import { Injectable } from '@angular/core';
import { Http, Response  } from '@angular/http';
import { Location } from '@angular/common';

import * as StackTrace from 'stacktrace-js';

import { environment } from '../../../environments/environment';
import { LogLevel } from './log-level.enum';
import { Log } from './log.model';

import { LocalStorageService } from '../../shared/local-storage.service';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoggingService {
  logData$: Observable<Log>;
  private _logDataSource: Subject<Log>;

  get logLevel(): LogLevel {
    return this.localstorageService.getLogLevel();
  }

  private _lastEmitedLog: Log = null;
  get lastEmitedLog(): Log {
    return this._lastEmitedLog;
  }

  constructor(private location: Location,
              private localstorageService: LocalStorageService,
              private http: Http) {
    this.initEmitter();
  }

  init(): void {
    this.initLogLevelForSession();
  }

  error(message: string, error?: any | Error): void {
    if (this.logLevel <= LogLevel.Error) {
      if (error instanceof Error) {
        this.parseError(error).then(errLog => {
          this.emitLog(errLog);
        }).catch(err => {
          this.warn('Warning. Could not parse error. Metod: parseError', err);
        });
      } else {
        this.emitLog(this.buildLog(message, LogLevel.Error, error));
      }
      // console.error('Error:', message);
    }
  }

  warn(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.Warn) {
      this.emitLog(this.buildLog(message, LogLevel.Warn, data));
    }
    // console.warn(message);
  }

  info(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.Info) {
      this.emitLog(this.buildLog(message, LogLevel.Info, data));
    }
    // console.info(message + ' ' + LogLevel[this.logLevel]);
  }

  debug(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.Debug) {
      this.emitLog(this.buildLog(message, LogLevel.Debug, data));
    }
    // console.debug(message);
  }

  handleHttpResponseError(error: Response | any): Observable<any> {
    let errMsg: string;
    try {
      if (error instanceof Response) {
        // console.log('handleHttpResponseError response.status:', error.status);
        errMsg = this.unwrapResponseError(error);
        this.warn(errMsg);
      } else {
        this.error('handleHttpResponseError (not Response error)', error);
        errMsg = error.message ? error.message : error.toString(); // No se si lo quiero mostrar
      }
    } catch (err) {
      this.error('handleHttpResponseError - Unexpected', err);
      errMsg = 'ErrUnexpected';
    }

    return Observable.throw(errMsg);
  }

  unwrapResponseError(response: Response): string {
    let retError: string;
    try {
      const body = response.json();
      if (body.error) {
        return body.error;
      }
      if(body.Message) {
        return body.Message;
      }
      // Sino viene en '.error' es un error de contrato o no controlado (que devuelve json). Devuelvo Unknown pero logueo el body
      this.error('unwrapResponseError - body.error is Undefined', body);
      retError = 'ErrUnknown'; // defensive
    } catch (err) {
      retError = 'ErrUnknown';
      // Intento extraer el detalle del error cuando no es un json normalizado (error contrato o error no controlado)
      try {
        const unhandledHttpResponse = { body: response.text(), status: response.status, statusText: response.statusText};
        this.error('unwrapResponseError - response.json() error', unhandledHttpResponse);
      } catch (e) {
        // sino funciona el logueo detallado, logueo el error del response.json() como para que quede constancia del error
        this.error('unwrapResponseError - Unhandled', err);
      }
    }

    return retError;
  }

  private emitLog(log: Log): void {
    this._lastEmitedLog = log;
    this._logDataSource.next(log);
  }

  private initEmitter() {
    this._logDataSource = new Subject<Log>();
    this.logData$ = this._logDataSource.asObservable();
  }

  private initLogLevelForSession(): void {
    if (!this.localstorageService.hasLogLevelSet()) {
      try {
        this.http.get(`${environment.API}api/log/apploglevel`)
                  .map((res: Response) => {
                    const logLevel = res.json() as LogLevel;
                    if (typeof LogLevel[logLevel] === 'undefined') {
                        throw new Error(`Enum ${logLevel} is not a valid LogLevel enum value`);
                    }
                    return logLevel;
                  })
                  .subscribe(
                    (logLevel: LogLevel) => {
                      this.localstorageService.setLogLevel(logLevel);
                    },
                    (err) => {
                      // console.error(err);
                      this.error('Could not initialize App LogLevel onInit. Http.get Error.', err);
                    }
                  );
      } catch (err) {
        this.error('Unhandled error: Could not initialize App LogLevel onInit.', err);
      }
    }
  }

  private parseError(error: any): Promise<Log> {
    return new Promise<Log>((resolve, reject) => {
      StackTrace.fromError(error).then(stackframes => {
        const stackTrace = stackframes
                          // .splice(0, 10)
                          .map(sframe => {
                            return sframe.toString();
                          })
                          .join('\n');

        // let url = this.location.path();
        const message = error.message ? error.message : error.toString();

        resolve(this.buildLog(message, LogLevel.Error, null, stackTrace));
      }).catch(err => {
        reject(err);
      });
    });
  }

  private buildLog(message: string, level: LogLevel, data?: any, stackTrace?: string): Log {
    const log = new Log(this.location.path(), message, LogLevel[level], stackTrace);

    if (data) {
      try {
        log.jsonData = JSON.stringify(data);
      } catch (error) {
        log.jsonData = `Error trying to stringify Data: ${error.message ? error.message : error.toString()}`;
      }
    }

    return log;
  }
}
