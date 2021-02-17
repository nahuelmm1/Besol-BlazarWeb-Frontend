import { Injectable } from '@angular/core';
import { DataTableCurrencyPipe } from '../../shared/pipes/data-table-currency-pipe';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class BillingColumns {
  private voucherNumber: any;
  private date: any;
  private userName: any;
  private amount: any;
  private pointOfSaleName: any;
  private sellerName: any;

  constructor(private translate: TranslateService) {
    this.voucherNumber = {
      name: this.translate.instant('voucher number'),
      prop: 'voucherNumber',
      width: 145,
      sortable: true,
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };

    this.date = {
      name: this.translate.instant('date'),
      prop: 'date',
      width: 175,
      sortable: true
    };

    this.userName = {
      name: this.translate.instant('userName'),
      prop: 'userName',
      width: 250,
      sortable: true
    };

    this.amount = {
      name: this.translate.instant('amount'),
      prop: 'amount',
      width: 130,
      sortable: true,
      pipe: new DataTableCurrencyPipe(),
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };

    this.pointOfSaleName = {
      name: this.translate.instant('point of sale'),
      prop: 'pointOfSaleName',
      width: 210,
      sortable: true
    };

    this.sellerName = {
      name: this.translate.instant('seller'),
      prop: 'sellerName',
      width: 250,
      sortable: true
    };
  }

  voucherNumberColumn(props?: any) {
    return Object.assign({}, this.voucherNumber, props);
  }

  dateColumn(props?: any) {
    return Object.assign({}, this.date, props);
  }

  userNameColumn(props?: any) {
    return Object.assign({}, this.userName, props);
  }

  amountColumn(props?: any) {
    return Object.assign({}, this.amount, props);
  }

  pointOfSaleNameColumn(props?: any) {
    return Object.assign({}, this.pointOfSaleName, props);
  }

  sellerNameColumn(props?: any) {
    return Object.assign({}, this.sellerName, props);
  }

}
