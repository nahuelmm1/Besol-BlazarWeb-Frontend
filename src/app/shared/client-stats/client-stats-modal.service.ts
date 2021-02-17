import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { ClientStatsModalComponent } from './client-stats-modal.component';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class ClientStatsModalService {

  constructor(private dialogRef: MdDialog,
    private translate: TranslateService
  ) { }

  show(clientId: number) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '90%';
    config.height = '800px';

    const dialogRef = this.dialogRef.open(ClientStatsModalComponent, config);
    dialogRef.componentInstance.clientId = clientId;
    return dialogRef.afterClosed();
  }
}
