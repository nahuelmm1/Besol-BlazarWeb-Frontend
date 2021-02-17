import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartDetailBoxModel } from '../../model/cart-detail-box.model';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-box-modal.component.html'
})
export class CartDetailBoxModalComponent {
  boxes: CartDetailBoxModel[];
  isLoading: boolean;

  constructor(private dialogRef: MdDialogRef<CartDetailBoxModalComponent>,
              private translate: TranslateService
              ) { }

  loadBoxes(boxes: CartDetailBoxModel[]): void {
    this.boxes = boxes;
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({
      doAction: true,
      boxes: this.boxes
    });
  }

  onDeleteBox(boxToDelete: CartDetailBoxModel) {
    this.boxes = this.boxes.filter((box) => box !== boxToDelete);
  }

  onAddBox(box: CartDetailBoxModel) {
    const newBox = new CartDetailBoxModel();
    this.boxes.push(newBox);
  }
}
