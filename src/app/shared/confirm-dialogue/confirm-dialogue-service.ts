import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { ConfirmDialogueComponent } from './confirm-dialogue';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class ConfirmDialogueService {

  constructor(private dialogRef: MdDialog,
    private translate: TranslateService
  ) { }

  confirm({ contentMessage, actionMessage = '', titleMessage = '', cancelMessage = '' }) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;

    const dialogRef = this.dialogRef.open(ConfirmDialogueComponent, config);
    dialogRef.componentInstance.contentMessage = contentMessage;
    dialogRef.componentInstance.titleMessage = titleMessage || this.translate.instant('attention');
    dialogRef.componentInstance.actionMessage = actionMessage || this.translate.instant('yes');
    dialogRef.componentInstance.cancelMessage = cancelMessage || this.translate.instant('cancel');

    return dialogRef.afterClosed();

  }
}
