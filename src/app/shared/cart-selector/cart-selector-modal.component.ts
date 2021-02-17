import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { CartSelectorModel } from './cart-selector.model';

@Component({
  moduleId: module.id,
  selector: 'cart-selector-modal',
  template: `
    <h2 md-dialog-title class="mat-dialog-title--strech">{{dialogTitle | translate}}</h2>
    <md-dialog-content>
      <cart-selector-grid [multipleSelection]="multipleSelection" [filter]="filter" (onSelectionChange)="onSelectionChange($event)">
      </cart-selector-grid>
    </md-dialog-content>
    <md-dialog-actions>
      <button md-raised-button color="primary" style="margin-right: 16px;" (click)="onAction()" [disabled]="!hasSelection()">
        {{'select' | translate}}</button>
      <button md-raised-button color="secondary" (click)="onCancel()">{{'cancel' | translate}}</button>
    </md-dialog-actions>
  `
})
export class CartSelectorModalComponent implements OnInit {
  @Input() multipleSelection: boolean;
  @Input() filter: any;
  dialogTitle: string;
  selectedCarts: Array<CartSelectorModel> = [];

  constructor(private dialogRef: MdDialogRef<CartSelectorModalComponent>,
              private translate: TranslateService
              ) { }

  ngOnInit() {
    this.dialogTitle = this.translate.instant(this.multipleSelection ? 'select carts' : 'select a cart');
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({
      doAction: true,
      selected: this.selectedCarts
    });
  }

  onSelectionChange(selection: Array<CartSelectorModel>): void {
    this.selectedCarts = selection;
  }

  hasSelection(): boolean {
    return this.selectedCarts.length > 0;
  }
}
