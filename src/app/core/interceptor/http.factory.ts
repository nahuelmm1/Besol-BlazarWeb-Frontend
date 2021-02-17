import { XHRBackend, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { HttpInterceptor } from './http.interceptor';
import { LocalStorageService } from '../../shared/local-storage.service';

export function httpFactory(xhrBackend: XHRBackend,
                            requestOptions: RequestOptions,
                            router: Router,
                            localStorage: LocalStorageService): Http {
    return new HttpInterceptor(xhrBackend, requestOptions, router, localStorage);
}
