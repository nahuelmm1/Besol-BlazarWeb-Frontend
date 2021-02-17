import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { ProductMovementsModalComponent } from './product-movements-modal.component';

@Injectable()
export class ProductMovementsModalService {

  constructor(private dialogRef: MdDialog,
    private translate: TranslateService
  ) { }

  show(description: string, productId: number) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;

    const dialogRef = this.dialogRef.open(ProductMovementsModalComponent, config);
    dialogRef.componentInstance.productId = productId;
    dialogRef.componentInstance.description = description;
    return dialogRef.afterClosed();
  }
}
