import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { User } from './models/user.model';
import { ComputerSettings } from './models/computer-settings.model';
import { Log } from '../core/logging/log.model';
import { LogLevel } from '../core/logging/log-level.enum';

@Injectable()
export class LocalStorageService {
  loggedInData$: Observable<User>;
  private _loggedInDataSource: BehaviorSubject<User>;
  private LOGGING_STORAGE_KEY: string = 'LOGGING_STORAGE';
  private LOGGING_LEVEL_STORAGE_KEY: string = '_LEVEL';

  constructor() {
    this.initUserDataSubject();
  }

  init() {
    this.clearAuthStorage();
  }

  private initUserDataSubject(): void {
    this._loggedInDataSource = new BehaviorSubject<User>(null);
    this.loggedInData$ = this._loggedInDataSource.asObservable();
  }

  public clearAuthStorage(): void {
    this.removeAccesToken();
    this.removeUser();
    this.removeRememberMeOption();
  }

  setRememberMeOption(remember: boolean) {
    localStorage.setItem(environment.REMEMBER_ME_STORAGE_KEY, JSON.stringify(remember));
  }

  removeRememberMeOption(): void {
    localStorage.removeItem(environment.REMEMBER_ME_STORAGE_KEY);
  }

  setUser(user: User): void {
    if (this.getRememberMeOption()) {
      localStorage.setItem(environment.AUTH_PROFILE_STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(environment.AUTH_PROFILE_STORAGE_KEY, JSON.stringify(user));
    }

    this._loggedInDataSource.next(user);
  }

  removeUser(): void {
    localStorage.removeItem(environment.AUTH_PROFILE_STORAGE_KEY);
    sessionStorage.removeItem(environment.AUTH_PROFILE_STORAGE_KEY);
    this._loggedInDataSource.next(null);
  }

  setAccessToken(accessToken: string): void {
    if (this.getRememberMeOption()) {
      localStorage.setItem(environment.AUTH_TOKEN_STORAGE_KEY, accessToken);
    } else {
      sessionStorage.setItem(environment.AUTH_TOKEN_STORAGE_KEY, accessToken);
    }
  }

  getAccessToken(): string {
    if (this.getRememberMeOption()) {
      return localStorage.getItem(environment.AUTH_TOKEN_STORAGE_KEY) || '';
    } else {
      return sessionStorage.getItem(environment.AUTH_TOKEN_STORAGE_KEY) || '';
    }
  }


  removeAccesToken(): void {
    localStorage.removeItem(environment.AUTH_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(environment.AUTH_TOKEN_STORAGE_KEY);
  }

  hasToken(): boolean {
    if (this.getRememberMeOption()) {
      return localStorage.getItem(environment.AUTH_TOKEN_STORAGE_KEY) !== null;
    } else {
      return sessionStorage.getItem(environment.AUTH_TOKEN_STORAGE_KEY) !== null;
    }
  }

  hasProfile(): boolean {
    if (this.getRememberMeOption()) {
      return localStorage.getItem(environment.AUTH_PROFILE_STORAGE_KEY) !== null;
    } else {
      return sessionStorage.getItem(environment.AUTH_PROFILE_STORAGE_KEY) !== null;
    }
  }

  getUserData(): User {
    if (!this.hasToken() || !this.hasProfile()) {
      return null;
    }

    if (this.getRememberMeOption()) {
      return JSON.parse(localStorage.getItem(environment.AUTH_PROFILE_STORAGE_KEY)) as User;
    } else {
      return JSON.parse(sessionStorage.getItem(environment.AUTH_PROFILE_STORAGE_KEY)) as User;
    }
  }

  getComputerSettings(): ComputerSettings {
    const settings = JSON.parse(localStorage.getItem(environment.SETTINGS_STORAGE_KEY));
    return new ComputerSettings().deserialize(settings);
  }

  setComputerSettings(settings: ComputerSettings): void {
    localStorage.setItem(environment.SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  private getRememberMeOption(): boolean {
    const rememberMe = JSON.parse(localStorage.getItem(environment.REMEMBER_ME_STORAGE_KEY)) as boolean;
    return rememberMe !== null && rememberMe;
  }

  // Error Logging
  hasLogLevelSet(): boolean {
    return sessionStorage.getItem(`${this.LOGGING_STORAGE_KEY}${this.LOGGING_LEVEL_STORAGE_KEY}`) !== null;
  }

  getLogLevel(): LogLevel {
    return JSON.parse(sessionStorage.getItem(`${this.LOGGING_STORAGE_KEY}${this.LOGGING_LEVEL_STORAGE_KEY}`)) as LogLevel || LogLevel.Error;
  }

  setLogLevel(logLevel: LogLevel): void {
    sessionStorage.setItem(`${this.LOGGING_STORAGE_KEY}${this.LOGGING_LEVEL_STORAGE_KEY}`, logLevel.toString());
  }

  addLog(log: Log): void {
    const logItems = this.getLogs();
    logItems.push(log);
    localStorage.setItem(this.LOGGING_STORAGE_KEY, JSON.stringify(logItems));
  }

  addLogs(logs: Array<Log>): void {
    const logItems = this.getLogs();
    const concatLogs = logItems.concat(logs);
    localStorage.setItem(this.LOGGING_STORAGE_KEY, JSON.stringify(concatLogs));
  }

  getLogs(): Array<Log> {
    return JSON.parse(localStorage.getItem(this.LOGGING_STORAGE_KEY)) as Array<Log> || new Array<Log>();
  }

  purgeLogs(): void {
    localStorage.removeItem(this.LOGGING_STORAGE_KEY);
  }
}
