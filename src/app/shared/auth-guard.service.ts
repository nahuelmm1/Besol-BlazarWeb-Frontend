import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { TranslateService } from '../core/translate/translate.service';
import { NotificationBarService } from '../shared/notification-bar-service/notification-bar-service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private auth: AuthService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log('AuthGuard: canActivate');
    return this.checkAuthRoleRoute(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log('AuthGuard: canActivateChild');
    return this.checkAuthRoleRoute(route, state);
  }

  private checkAuthRoleRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.loggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }

    const user = this.localStorageService.getUserData();
    let url = state.url;

    if (route.data && route.data.security) {
      url = route.data.security;
    }
    if (user == null || user.routes == null || !user.routes.some(r => r === url)) {
         if (url === '/' ||  this.router.url.indexOf('/login') >= 0) {
          this.router.navigate([user.routes[0]]);
         } else {
          this.router.navigate(['/login']);
          this.notificationBar.error('ErrForbidden');
          return false;
        }
    }
    return true;
  }
}
