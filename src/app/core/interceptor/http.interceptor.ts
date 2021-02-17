import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../../shared/local-storage.service';
// import { isInLoginRoute } from '../../core/helpers/url.helper';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class HttpInterceptor extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions,
                private router: Router,
                private localStorage: LocalStorageService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(options, (opts: RequestOptionsArgs) => this.interceptAfter(super.request(url, opts)));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(options, (opts: RequestOptionsArgs) => this.interceptAfter(super.get(url,opts)));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(options, (opts) => this.interceptAfter(super.post(url, body, opts)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(options, (opts) => this.interceptAfter(super.put(url, body, opts)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
      return this.intercept(options, (opts) => this.interceptAfter(super.delete(url, opts)));
    }

    private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options === null || options === undefined) {
            options = new RequestOptions();
        }

        if (options.headers === null || options.headers === undefined) {
            options.headers = new Headers();
        }

        // Salvo que se explicite otra cosa, todo es app/json

        if (!options.headers.has('Content-Type') && !options.headers.has('Accept')) {
          options.headers.append('Content-Type', 'application/json');
        }

        // Agrego el token a cada request
        const token = this.localStorage.getAccessToken();
        options.headers.append('Authorization', `Bearer ${token}`);

        return options;
    }

    private intercept(options: RequestOptionsArgs,
                      request: (options: RequestOptionsArgs) => Observable<Response>) : Observable<Response> {
      //Before request
      let interceptOptions = this.getRequestOptionArgs(options);

      //Request and apply interceptAfter
      return request(interceptOptions);
    }

    private interceptAfter(observable: Observable<Response>): Observable<Response> {
      return observable.catch((err, source) => {
        if (err.status === 0 && err.url === null) {
          err._body = '{"error":"ErrServerUnavailable"}';
          return Observable.throw(err);
        } else if (err.status === 401 && !this.isInLoginRoute(err.url)) {
          //console.log(err.body);
          this.localStorage.clearAuthStorage();
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
          return Observable.empty(); //never();
        } else if (err.status === 403) {
          err._body = '{"error":"ErrForbidden"}';
          return Observable.throw(err);
        } else {
          return Observable.throw(err);
        }
      });
    }

    private isLocalAssetRequest(url: string) {
      return !(url.search('.json') === -1);
    }

    private isInLoginRoute(routeUrl: string): boolean {
      return !(routeUrl.search('/login') === -1);
    }
}
