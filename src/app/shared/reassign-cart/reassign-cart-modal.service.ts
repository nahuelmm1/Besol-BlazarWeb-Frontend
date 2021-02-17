import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { ReassignCartModalComponent } from './reassign-cart-modal.component';

@Injectable()
export class ReassignCartModalService {

  constructor(private dialogRef: MdDialog,
    private translate: TranslateService
  ) { }

  show(cartNumber: number) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;

    const dialogRef = this.dialogRef.open(ReassignCartModalComponent, config);
    dialogRef.componentInstance.cartNumber = cartNumber;
    return dialogRef.afterClosed();
  }
}
