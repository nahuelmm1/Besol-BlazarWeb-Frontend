import { Injectable } from '@angular/core';
import { DataTableCurrencyPipe } from '../../shared/pipes/data-table-currency-pipe';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class PurchaseOrderCreateColumns {
  private article: any;
  private colour: any;
  private size: any;
  private store: any;
  private minStock: any;
  private stock: any;
  private sold: any;
  private unitPrice: any;
  private quantity: any;

  constructor(private translate: TranslateService) {

    this.article = {
      name: this.translate.instant('article'),
      prop: 'article',
      width: 25,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.colour = {
      name: this.translate.instant('colour'),
      prop: 'colour',
      width: 60,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.size = {
      name: this.translate.instant('size'),
      prop: 'size',
      width: 60,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.store = {
      name: this.translate.instant('store'),
      prop: 'store',
      width: 70,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.minStock = {
      name: this.translate.instant('min stock'),
      prop: 'minStock',
      width: 50,
      sortable: false,
      cellClass: 'u-textCenter  Cell--strechSidePadding',
      headerClass: 'u-textCenter  Cell--strechSidePadding'
    };

    this.stock = {
      name: this.translate.instant('stock'),
      prop: 'stock',
      width: 50,
      sortable: false,
      cellClass: 'u-textCenter  Cell--strechSidePadding',
      headerClass: 'u-textCenter  Cell--strechSidePadding'
    };

    this.sold = {
      name: this.translate.instant('sold'),
      prop: 'sold',
      width: 40,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.unitPrice = {
      name: this.translate.instant('unit price|short'),
      prop: 'unitPrice',
      width: 80,
      sortable: false,
      pipe: new DataTableCurrencyPipe(),
      cellClass: 'u-textRight Cell--strechSidePadding',
      headerClass: 'u-textRight Cell--strechSidePadding'
    };

    this.quantity = {
      name: this.translate.instant('quantity'),
      prop: 'quantity',
      width: 170,
      sortable: false,
      cellClass: 'u-textCenter',
      headerClass: 'u-textCenter'
    };

  }

  articleColumn(props?: any) {
    return Object.assign({}, this.article, props);
  }

  colourColumn(props?: any) {
    return Object.assign({}, this.colour, props);
  }

  sizeColumn(props?: any) {
    return Object.assign({}, this.size, props);
  }

  storeColumn(props?: any) {
    return Object.assign({}, this.store, props);
  }

  minStockColumn(props?: any) {
    return Object.assign({}, this.minStock, props);
  }

  stockColumn(props?: any) {
    return Object.assign({}, this.stock, props);
  }

  soldColumn(props?: any) {
    return Object.assign({}, this.sold, props);
  }

  unitPriceColumn(props?: any) {
    return Object.assign({}, this.unitPrice, props);
  }

  quantityColumn(props?: any) {
    return Object.assign({}, this.quantity, props);
  }

}
