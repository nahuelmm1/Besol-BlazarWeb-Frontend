import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartDetailProductModel } from '../../model/cart-detail-product.model';
import { CartService } from '../../service/cart.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../../shared/page-loader-service';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-option-product-modal.component.html'
})
export class CartDetailOptionProductModalComponent {
  cartProduct: CartDetailProductModel;
  products: CartDetailProductModel[];
  isLoading: boolean;

  constructor(private dialogRef: MdDialogRef<CartDetailOptionProductModalComponent>,
              private cartService: CartService,
              private notificationBar: NotificationBarService,
              private pageLoaderService: PageLoaderService,
              private translate: TranslateService
              ) { }

  loadOptions(products: CartDetailProductModel[]): void {
    this.products = products;
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    const selectedProducts = this.products.filter((product) => product.selected);
    if (selectedProducts.length === 0) {
      this.notificationBar.warning('ErrCartAddSelectProduct');
      return;
    }
    this.dialogRef.close({
      doAction: true,
      products: selectedProducts,
    });
  }

}
