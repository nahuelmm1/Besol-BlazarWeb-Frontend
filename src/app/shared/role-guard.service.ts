import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { MdSnackBar } from '@angular/material';

import { LocalStorageService } from './local-storage.service';

@Injectable()
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private snackBar: MdSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log('RoleGuard: canActivate');
    return this.checkRouteAuth(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // console.log('RoleGuard: canActivateChild');
    return this.checkRouteAuth(route, state);
  }

  private checkRouteAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.localStorageService.getUserData();
    // console.log('RoleGuard', state.url);
    // console.log('RoleGuard', user === null);
    if (user === null || !user.routes.some(r => r === state.url)) {
      // console.log('RoleGuard -> CAN NOT ACTIVATE');
      this.snackBar.open('Forbidden', '', {
        duration: 3500,
        extraClasses: ['snackError']
      });
      return false;
    }
    // console.log('RoleGuard -> ROUTE ACTIVATED');
    return true;
  }
}
