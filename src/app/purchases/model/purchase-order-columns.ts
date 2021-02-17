import { Injectable } from '@angular/core';
import { DataTableCurrencyPipe } from '../../shared/pipes/data-table-currency-pipe';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class PurchaseOrderColumns {
  private nroOC: any;
  private brand: any;
  private date: any;
  private store: any;
  private requestedProducts: any;
  private receivedProducts: any;
  private totalAmount: any;
  private read: any;
  private delivered: any;

  constructor(private translate: TranslateService) {

    this.nroOC = {
      name: this.translate.instant('purchase order number'),
      prop: 'nroOC',
      width: 60,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.brand = {
      name: this.translate.instant('brand'),
      prop: 'brand',
      width: 120,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.date = {
      name: this.translate.instant('date'),
      prop: 'date',
      width: 105,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.store = {
      name: this.translate.instant('store'),
      prop: 'store',
      width: 90,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };

    this.requestedProducts = {
      name: this.translate.instant('requested products'),
      prop: 'requestedProducts',
      width: 90,
      sortable: false,
      cellClass: 'u-textCenter  Cell--strechSidePadding',
      headerClass: 'u-textCenter  Cell--strechSidePadding'
    };

    this.receivedProducts = {
      name: this.translate.instant('received products'),
      prop: 'receivedProducts',
      width: 90,
      sortable: false,
      cellClass: 'u-textCenter  Cell--strechSidePadding',
      headerClass: 'u-textCenter  Cell--strechSidePadding'
    };

    this.totalAmount = {
      name: this.translate.instant('total amount'),
      prop: 'totalAmount',
      width: 100,
      sortable: false,
      pipe: new DataTableCurrencyPipe(),
      cellClass: 'u-textRight Cell--strechSidePadding',
      headerClass: 'u-textRight Cell--strechSidePadding'
    };

    this.delivered = {
      name: this.translate.instant('delivered'),
      prop: 'delivered',
      width: 45,
      sortable: false,
      cellClass: 'u-textCenter',
      headerClass: 'u-textCenter'
    };

    this.read = {
      name: this.translate.instant('read'),
      prop: 'read',
      width: 45,
      sortable: false,
      cellClass: 'u-textCenter',
      headerClass: 'u-textCenter'
    };

  }

  nroOCColumn(props?: any) {
    return Object.assign({}, this.nroOC, props);
  }

  brandColumn(props?: any) {
    return Object.assign({}, this.brand, props);
  }

  dateColumn(props?: any) {
    return Object.assign({}, this.date, props);
  }

  storeColumn(props?: any) {
    return Object.assign({}, this.store, props);
  }

  requestedProductsColumn(props?: any) {
    return Object.assign({}, this.requestedProducts, props);
  }

  receivedProductsColumn(props?: any) {
    return Object.assign({}, this.receivedProducts, props);
  }

  totalAmountColumn(props?: any) {
    return Object.assign({}, this.totalAmount, props);
  }

  deliveredColumn(props?: any) {
    return Object.assign({}, this.delivered, props);
  }

  readColumn(props?: any) {
    return Object.assign({}, this.read, props);
  }

}
