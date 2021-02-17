import { Component, Input, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartDetailProductModel } from '../../model/cart-detail-product.model';
import { CartService } from '../../service/cart.service';
import { PageLoaderService } from '../../../shared/page-loader-service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-missing-stock-modal.component.html'
})
export class CartDetailMissingStockModalComponent implements OnInit {
  @Input() products: CartDetailProductModel[];
  @Input() cartNumber: number;
  columns: any;
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  ngOnInit(): void {
    this.columns = [
      {
        name: this.translate.instant('brand'),
        prop: 'brand',
        width: 150,
        sortable: false,
        cellClass: 'Cell--strechSidePadding',
        headerClass: 'Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('article|short'),
        prop: 'article',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight Cell--strechSidePadding',
        headerClass: 'u-textRight Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('color'),
        prop: 'color',
        width: 60,
        sortable: false,
        cellClass: 'Cell--strechSidePadding',
        headerClass: 'Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('size'),
        prop: 'size',
        width: 60,
        sortable: false,
        cellClass: 'Cell--strechSidePadding',
        headerClass: 'Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('missing'),
        prop: 'stockDifference',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight Cell--strechSidePadding',
        headerClass: 'u-textRight Cell--strechSidePadding'
      },
    ];
  }

  constructor(private dialogRef: MdDialogRef<CartDetailMissingStockModalComponent>,
              private cartService: CartService,
              private pageLoaderService: PageLoaderService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) { }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({
      doAction: true
    });
  }

  onPrint() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.downloadMissingStock(this.cartNumber)
      .subscribe(
        () => {
          this.pageLoaderService.setPageLoadingStatus(false);
        },
        (err) => {
          this.pageLoaderService.setPageLoadingStatus(false);
          this.notificationBar.error(err);
        }
      );
  }
}
