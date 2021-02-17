import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User } from './models/user.model';

import { LocalStorageService } from './local-storage.service';
import { LoggingService } from '../core/logging/logging.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {
  _fooRememberMe: boolean; // Session or Local Storage

  constructor(private http: Http,
              private router: Router,
              private localStorage: LocalStorageService,
              private logService: LoggingService) { }

  login(credentials: any): Observable<any> {
    try {
      const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      const options = new RequestOptions({ headers: headers });
      const data = 'grant_type=password&username=' + credentials.user + '&password=' + credentials.password;

      return this.http.post(`${environment.API}token`, data, options)
                        .map((res: Response) => res.json().access_token)
                        .flatMap((token: string) => {
                          this.localStorage.setRememberMeOption(credentials.remember);
                          this.localStorage.setAccessToken(token);
                          return this.getUser();
                        })
                        .flatMap(user => {
                          this.localStorage.setUser(user);
                          return Observable.of(user);
                        })
                        .catch((error: any) => {
                            this.localStorage.removeUser();
                            this.localStorage.removeAccesToken();
                            // return Observable.throw('Usuario y/o contraseña son incorrectos');
                            return this.logService.handleHttpResponseError(error);
                        });
    } catch (error) {
      this.logService.error('AuthService.login - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  logout() {
    this.localStorage.clearAuthStorage();
    // Send the user back to homepage after logout
    this.router.navigate(['/login']);
  }

  // Check to see if the user is logged in if they have a token and whether that token is valid or not.
  loggedIn(): boolean {
    // return tokenNotExpired(); //Jwt --ls.gettoken..validate
    return this.localStorage.hasToken();
  }

  getUser(): Observable<User> {
    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    const options = new RequestOptions({ headers: headers });

    try {
      return this.http.get(`${environment.API}api/account/GetUser`, options)
                    .map((res: Response) => {
                      return new User().deserialize(res.json());
                    })
                    .catch((error: any) => {
                      return this.logService.handleHttpResponseError(error);
                    });
    } catch (error) {
      this.logService.error('AuthService.getUser - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
