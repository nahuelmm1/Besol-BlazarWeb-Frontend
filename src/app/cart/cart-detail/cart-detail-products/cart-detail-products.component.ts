import { Component, OnInit, ViewChild, Output, Input, EventEmitter, TemplateRef } from '@angular/core';

import { TranslateService } from '../../../core/translate/translate.service';
import { CartDetailModel } from '../../model/cart-detail.model';
import { CartDetailProductModel } from '../../model/cart-detail-product.model';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-products.component.html',
  selector: 'bla-cart-detail-products'
})

export class CartDetailProductsComponent implements OnInit {
  @ViewChild('lockedCellTemplate') lockedCellTemplate: TemplateRef<any>;
  @ViewChild('confirmedCellTemplate') confirmedCellTemplate: TemplateRef<any>;
  @ViewChild('stockCellTemplate') stockCellTemplate: TemplateRef<any>;
  @ViewChild('optionCommentCellTemplate') optionCommentCellTemplate: TemplateRef<any>;

  cart: CartDetailModel;
  @Input() loading: boolean = false;
  @Input() products: Array<CartDetailProductModel>;
  @Input() authorization: any;
  @Output() onConfirmChange = new EventEmitter<CartDetailProductModel>();
  @Output() onLockChange = new EventEmitter<CartDetailProductModel>();
  @Output() onDeleteAdded = new EventEmitter<CartDetailProductModel>();
  @Output() onOptionComment = new EventEmitter<CartDetailProductModel>();
  @Output() onDblClick = new EventEmitter<CartDetailProductModel>();

  columns: any = [];
  getRowClassBound: Function;
  getConfirmedCheckedBound: Function;
  getConfirmedEnabledBound: Function;
  onConfirmBound: Function;
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  constructor(
              private translate: TranslateService) {
    this.getConfirmedCheckedBound = this.getConfirmedChecked.bind(this);
    this.getConfirmedEnabledBound = this.getConfirmedEnabled.bind(this);
    this.onConfirmBound = this.onConfirm.bind(this);
  }

  ngOnInit(): void {
    this.columns = [
      {
        name: this.translate.instant('locked|short'),
        prop: 'locked',
        cellTemplate: this.lockedCellTemplate,
        width: 55,
        sortable: false,
        cellClass: 'u-textCenter Cell--strechSidePadding',
        headerClass: 'u-textCenter Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('confirmed|short'),
        prop: 'confirmed',
        cellTemplate: this.confirmedCellTemplate,
        width: 75,
        sortable: false,
        cellClass:  (r) => this.getConfirmCellClass(r),
        headerClass: 'u-textCenter Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('stock'),
        cellTemplate: this.stockCellTemplate,
        width: 100,
        sortable: false,
        cellClass: 'u-textRight Cell--strechSidePadding',
        headerClass: 'u-textRight Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('cart'),
        prop: 'fromCart',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight Cell--strechSidePadding',
        headerClass: 'u-textRight Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('quantity|short'),
        prop: 'quantity',
        width: 55,
        sortable: false,
        cellClass: 'u-textRight Cell--strechSidePadding',
        headerClass: 'u-textRight Cell--strechSidePadding'
      },
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
        name: this.translate.instant('unit price|short'),
        prop: 'unitPrice',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight Cell--strechSidePadding',
        headerClass: 'u-textRight Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('total'),
        prop: 'total',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight Cell--strechSidePadding',
        headerClass: 'u-textRight Cell--strechSidePadding'
      },
      {
        name: this.translate.instant('option'),
        prop: 'optionComment',
        cellTemplate: this.optionCommentCellTemplate,
        width: 150,
        sortable: false,
        cellClass: 'Cell--strechSidePadding',
        headerClass: 'Cell--strechSidePadding'
      },
    ];
  }

  handleActivate(activateInfo): void {
    // if (activateInfo.type === 'click' && activateInfo.row) {
    //   this.toggleSelected(activateInfo.row);
    // }
    if (activateInfo.type === 'dblclick' && activateInfo.row) {
      this.onDblClick.emit(activateInfo.row);
    }
  }

  getRowClass(cart: CartDetailProductModel) {
    return {
    };
  }

  getStockTitle(row: CartDetailProductModel): string {
    return `Cantidad en stock ${row.stock}\nCantidad en control ${row.stockControl}\nCantidad en la esquina ${row.stockCorner}\nCantidad en sarmiento ${row.stockSarmiento}`;
  }

  onLock(row: CartDetailProductModel): void {
    this.onLockChange.emit(row);
  }

  onDeleteProduct(row: CartDetailProductModel): void {
    this.onDeleteAdded.emit(row);
  }

  getConfirmedEnabled(row: CartDetailProductModel): boolean {
    // if (this.authorization.allowConfirmProduct) {
    //   return !row.locked;
    // } else {
    //   return false;
    // }
    return this.authorization.allowConfirmProduct && !row.locked;
  }

  getConfirmedChecked(row: CartDetailProductModel): boolean {
    return row.confirmed;
  }

  onConfirm(row: CartDetailProductModel): void {
    this.products.find((p: CartDetailProductModel) => {
      return p.rowNumber === row.rowNumber
    }).confirmed = !row.confirmed;
    let temp = this.products.sort((a: CartDetailProductModel, b: CartDetailProductModel) => CartDetailProductModel.sortProducts(a,b));
    temp.find((p: CartDetailProductModel) => {
      return p.rowNumber === row.rowNumber
    }).confirmed = !row.confirmed;
    this.products = [...temp];
    this.onConfirmChange.emit(row);
  }

  getConfirmCellClass({ row }) {
    return {
      'Cell--action': row.added && this.authorization.allowDeleteAddedProduct,
      'u-textCenter': true,
      'Cell--strechSidePadding': true,
    };
  }

  onOptionCommentClick(event, row: CartDetailProductModel): void {
    if (this.authorization.allowAddOptionProduct) {
      this.onOptionComment.emit(row);
    }
    event.preventDefault();
  }
}
