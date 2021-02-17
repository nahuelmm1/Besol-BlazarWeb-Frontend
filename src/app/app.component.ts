import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import {MediaReplayService} from './core/mediareplay/media-replay.service';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../environments/environment';

import { TranslateService } from './core/translate/translate.service';
import { PageLoaderService } from './shared/page-loader-service';

import { LoggingService } from './core/logging/logging.service';
import { LoggingHttpService } from './core/logging/log-http.service';
import { LocalStorageService } from './shared/local-storage.service';

import { DateAdapter } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  title: string;

  pageLoaderSubscription: Subscription;
  isLoading: boolean = false;


  constructor(mediaReplayService: MediaReplayService,
             private translate: TranslateService,
             private pageLoaderService: PageLoaderService,
             private loggingService: LoggingService,
             private loggingHttpService: LoggingHttpService,
             private dateAdapter: DateAdapter<Date>,
             private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.configureLang();
    this.pageLoaderSubscription = this.pageLoaderService.pageLoading$.subscribe((isLoading: boolean) => this.isLoading = isLoading);
    this.localStorageService.init();
    this.loggingService.init();
    this.loggingHttpService.init();
  }

  ngOnDestroy(): void {
    this.unsubsribeToLangChange();
    this.pageLoaderSubscription.unsubscribe();
  }

  configureLang(): void {
    this.subsribeToLangChange();
    // set language
    this.translate.setDefaultLang(environment.DEFAULT_LANG);
    this.translate.enableFallback(true);
    // set current language
    this.selectLang(environment.CURRENT_LANG);
    // set AngMaterial Locale
    this.dateAdapter.setLocale(environment.LOCALE);
  }

   /**
  * Set current Languaje;
  */
  selectLang(lang: string) {
      this.translate.use(lang);
  }

  subsribeToLangChange(): void {
    this.translate.onLangChanged.subscribe(() => this.translateTexts());
  }

  unsubsribeToLangChange(): void {
    this.translate.onLangChanged.unsubscribe();
  }

  translateTexts(): void {
    this.title = this.translate.instant('page title');
  }
}
