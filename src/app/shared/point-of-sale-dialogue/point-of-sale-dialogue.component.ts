import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { PointOfSaleModel } from '../models/point-of-sale.model';
import { TranslateService } from '../../core/translate/translate.service';

@Component({
  moduleId: module.id,
  selector: 'point-of-sale-dialogue',
  template: `
  <h2 md-dialog-title>{{'select point of sale' | translate}}</h2>
    <md-dialog-content>
      <md-nav-list>
        <h3 md-subheader>{{'select point of sale legend' | translate}}</h3>
        <a href="javascript:;" (click)="select(pointOfSale)"
          md-list-item *ngFor="let pointOfSale of pointsOfSale"
          [ngClass]="{ 'selected': pointOfSale === selectedPos}">
          <h3 md-line> {{pointOfSale.name}} </h3>
        </a>
      </md-nav-list>
    </md-dialog-content>
    <md-dialog-actions>
      <button md-raised-button color="primary" style="margin-right: 16px;" (click)="onAction()">{{'select' | translate}}</button>
      <button md-raised-button color="secondary" (click)="onCancel()">{{'cancel' | translate}}</button>
    </md-dialog-actions>
  `
})
export class PointOfSaleDialogueComponent {
  pointsOfSale: Array<PointOfSaleModel> = [];
  selectedPos: PointOfSaleModel;

  constructor(private dialogRef: MdDialogRef<PointOfSaleDialogueComponent>,
              private translate: TranslateService) { }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({ doAction: true, pointOfSale: this.selectedPos});
  }

  select(pos) {
    this.selectedPos = pos;
  }
}
