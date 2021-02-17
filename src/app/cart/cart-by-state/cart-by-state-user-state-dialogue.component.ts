import { CartService } from './../service/cart.service';
import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';

import { TranslateService } from '../../core/translate';
import { CartByStateItem } from '../model/cart-by-state.model';

@Component({
  moduleId: module.id,
  selector: 'cart-by-state-user-state-dialogue',
  templateUrl: 'cart-by-state-user-state-dialogue.component.html',
})
export class CartByStateUserStateDialogueComponent implements OnInit {

  type: string = '';
  cart: CartByStateItem = null;

  constructor(private dialogRef: MdDialogRef<CartByStateUserStateDialogueComponent>,
              private cartService: CartService,
              private snackBar: MdSnackBar,
              private translate: TranslateService) { }

  ngOnInit(): void {
    if (this.cart.isCarriedFromPointOfSale) {
      this.type = 'express';
    } else {
      this.type = 'buyer';
    }
  }

  closeModal(): void {
    this.dialogRef.close({doAction: false});
  }

  addGroup(): void {
    const cart = {
      'cartNumber': this.cart.cartNumber
    };
    this.cartService.addGroupUserbyCart(cart).subscribe(() => {
      this.snackBar.open(this.translate.instant('group added'), '', {
        duration: 10000
      });
      this.dialogRef.close({doAction: true});
    }, () => {
      this.snackBar.open(this.translate.instant('group added error'), '', {
        duration: 10000,
        extraClasses: ['snackError']
      });
    });
  }

}
