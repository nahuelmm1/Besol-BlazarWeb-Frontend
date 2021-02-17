import {Component, OnInit, Inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from "rxjs";
import {MediaChange} from "@angular/flex-layout";
import {MediaReplayService} from '../mediareplay/media-replay.service';
import {Router, NavigationEnd} from "@angular/router";
import * as screenfull from 'screenfull';

import { AuthService } from '../../shared/auth.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'ms-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

  @ViewChild('sidenav')
  sidenav;

  private _mediaSubscription: Subscription;
  sidenavOpen: boolean = true;
  sidenavMode: string = 'side';
  isMobile: boolean = false;

  private _routerEventsSubscription: Subscription;

  quickpanelOpen: boolean = false;
  isFullscreen: boolean = false;

  private localStorageSubscription: Subscription;
  user: User = null;

  constructor(
    private mediaReplayService: MediaReplayService,
    private router: Router,
    private auth: AuthService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {
    this._mediaSubscription = this.mediaReplayService.media$.subscribe((change: MediaChange) => {
      let isMobile = (change.mqAlias == 'xs') || (change.mqAlias == 'sm');
      this.isMobile = isMobile;
      this.sidenavMode = (isMobile) ? 'over' : 'side';
      this.sidenavOpen = !isMobile;
    });

    this._routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.isMobile) {
        this.sidenav.close();
      }
    });

    this.subscribeTolocalStorage();
  }

  toggleFullscreen() {
    if (screenfull.enabled) {
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    }
  }

  ngOnDestroy() {
    this._mediaSubscription.unsubscribe();
    this.localStorageSubscription.unsubscribe();
  }

  onActivate(e, scrollContainer) {
    scrollContainer.scrollTop = 0;
  }

  subscribeTolocalStorage(): void {
      this.localStorageSubscription = this.localStorage.loggedInData$.subscribe(
        (user) => {
          this.user = user;
        }
      );
    }

  logout(): void {
    this.auth.logout();
  }

  settings(): void {
    console.log('settings');
    this.router.navigate(['/settings']);
  }
}
