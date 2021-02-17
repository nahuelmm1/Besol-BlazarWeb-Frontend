import { Injectable, Inject, EventEmitter } from '@angular/core';
import { TRANSLATIONS } from './translations';

@Injectable()
export class TranslateService {
  onLangChanged: EventEmitter<string> = new EventEmitter<string>();

  private _defaultLang: string;
  private _currentLang: string;
  private _fallback: boolean;
  private PLACEHOLDER = '%';

  public get currentLang(): string {
    return this._currentLang || this._defaultLang;
  }

  constructor(@Inject(TRANSLATIONS) private translations: any) { }

  setDefaultLang(lang: string): void {
    this._defaultLang = lang;
  }

  enableFallback(enable: boolean): void {
    this._fallback = enable;
  }

  use(lang: string): void {
    if (lang !== this._currentLang) {
      this._currentLang = lang;
      this.onLangChanged.emit(lang);
    }
  }

  instant(key: string, words?: string | string[]): string {
    const translation: string = this.translate(key);

    if (!words) {
      return translation;
    }

    return this.replace(translation, words);
  }

  private replace(word: string = '', words: string | string[] = ''): string {
    let translation: string = word;

    const values: string[] = [].concat(words);
    values.forEach((e, i) => {
        translation = translation.replace(this.PLACEHOLDER.concat(<any>i), e);
    });

    return translation;
  }

  private translate(key: string): string {
    const translation = key;

    if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
        return this.translations[this.currentLang][key];
    }

    if (!this._fallback) {
        return translation;
    }

    // found in default language
    if (this.translations[this._defaultLang] && this.translations[this._defaultLang][key]) {
        return this.translations[this._defaultLang][key];
    }

    return translation;
  }
}
