import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogConfig, MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartService } from '../../service/cart.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { FormControl } from '@angular/forms';
import { PageLoaderService } from '../../../shared/page-loader-service';
import { CartDetailProductModel } from '../../model/cart-detail-product.model';
import { CartDetailMissingStockModalComponent } from '../cart-detail-missing-stock-modal/cart-detail-missing-stock-modal.component';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-change-state-modal.component.html'
})
export class CartDetailChangeStateModalComponent implements OnInit {
  isLoading: boolean;
  states: any[];
  selectedState = new FormControl();
  comment = new FormControl();
  @Input() cartNumber: number;

  constructor(private dialogRef: MdDialogRef<CartDetailChangeStateModalComponent>,
              private dialog: MdDialog,
              private cartService: CartService,
              private pageLoaderService: PageLoaderService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) { }

  ngOnInit(): void {
    this.loadStates();
    this.selectedState.setValue(1);
    this.selectedState.markAsPristine();
    this.comment.setValue('');
    this.comment.markAsPristine();
  }

  loadStates(): void {
    this.cartService.getStates().subscribe(
      (states) => {
        this.states = states;
      },
      (err) => {
        this.notificationBar.error(err);
      }
  );
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    const dto = {
      cartNumber: this.cartNumber,
      stateId: this.selectedState.value,
      comment: this.comment.value
    };
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.updateState(dto).subscribe(
      (response) => {
        this.pageLoaderService.setPageLoadingStatus(false);
        if (response.missingStock) {
          this.onMissingStock(response.products);
        } else {
          this.dialogRef.close({
            doAction: true,
            cart: response.cart
          });
        }
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );  
  }

  onMissingStock(products: CartDetailProductModel[]) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '60%';

    const dialogRef = this.dialog.open(CartDetailMissingStockModalComponent, config);
    dialogRef.componentInstance.products = products;
    dialogRef.componentInstance.cartNumber = this.cartNumber;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.pageLoaderService.setPageLoadingStatus(true);
          const dto = {
            cartNumber: this.cartNumber,
          };
          this.cartService.fixStock(dto).subscribe(
            () => {
              this.pageLoaderService.setPageLoadingStatus(false);
            },
            (err) => {
              this.notificationBar.error(err);
              this.pageLoaderService.setPageLoadingStatus(false);
            }
          );
        }
      }
    );
  }
}
