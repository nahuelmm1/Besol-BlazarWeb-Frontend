import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class NotificationBarService {

  constructor(
    public snackBar: MdSnackBar,
    private translate: TranslateService
  ) { }

  error(err, translate = true) {
    const message = translate ? this.translate.instant(err) : err;
    this.notify(message, ['snackError'], 3500);
  }

  warning(msg, translate = true) {
    const message = translate ? this.translate.instant(msg) : msg;
    this.notify(message, ['snackWarning'], 3500);
  }

  success(msg, translate = true) {
    const message = translate ? this.translate.instant(msg) : msg;
    this.notify(message, ['snackSuccess'], 5000);
  }

  notify(message, extraClasses, duration) {
    this.snackBar.open(message, 'x', {
      duration,
      extraClasses
    });
  }
}
