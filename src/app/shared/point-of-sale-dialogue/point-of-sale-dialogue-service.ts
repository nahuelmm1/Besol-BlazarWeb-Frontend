import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { PointOfSaleDialogueComponent } from './point-of-sale-dialogue.component';
import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleModel } from '../models/point-of-sale.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PointOfSaleDialogueService {

  constructor(private dialogRef: MdDialog,
    private translate: TranslateService
  ) { }

  selectPointOfSale(pointsOfSaleObs: Observable<PointOfSaleModel[]>) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;

    const dialogRef = this.dialogRef.open(PointOfSaleDialogueComponent, config);

    pointsOfSaleObs.subscribe((pointsOfSale: Array<PointOfSaleModel>) => {
      dialogRef.componentInstance.selectedPos = pointsOfSale[0];
      dialogRef.componentInstance.pointsOfSale = pointsOfSale;
    });

    return dialogRef.afterClosed();

  }
}
