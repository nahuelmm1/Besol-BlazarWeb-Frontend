import { Injectable } from '@angular/core';
import { DataTableCurrencyPipe } from '../../shared/pipes/data-table-currency-pipe';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class CashRegisterColumns {
  private date: any;
  private operation: any;
  private voucherNumber: any;
  private userName: any;
  private amount: any;
  private amountInland: any;
  private amountExpress: any;

  constructor(private translate: TranslateService) {
    this.date = {
      name: this.translate.instant('date'),
      prop: 'date',
      width: 200,
      sortable: false
    };

    this.operation = {
      name: this.translate.instant('operation'),
      prop: 'operation',
      width: 140,
      sortable: false
    };

    this.voucherNumber = {
      name: this.translate.instant('voucher number'),
      prop: 'voucherNumber',
      width: 210,
      sortable: false,
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };
    this.userName = {
      name: this.translate.instant('userName'),
      prop: 'userName',
      width: 250,
      sortable: false
    };

    this.amount = {
      name: this.translate.instant('amount'),
      prop: 'amount',
      width: 130,
      sortable: false,
      pipe: new DataTableCurrencyPipe(),
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };

    this.amountInland = {
      name: this.translate.instant('amount inland'),
      prop: 'amountInland',
      width: 130,
      sortable: false,
      pipe: new DataTableCurrencyPipe(),
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };

    this.amountExpress = {
      name: this.translate.instant('amount express'),
      prop: 'amountExpress',
      width: 130,
      sortable: false,
      pipe: new DataTableCurrencyPipe(),
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };
  }

  dateColumn(props?: any) {
    return Object.assign({}, this.date, props);
  }

  operationColumn(props?: any) {
    return Object.assign({}, this.operation, props);
  }

  voucherNumberColumn(props?: any) {
    return Object.assign({}, this.voucherNumber, props);
  }

  userNameColumn(props?: any) {
    return Object.assign({}, this.userName, props);
  }

  amountColumn(props?: any) {
    return Object.assign({}, this.amount, props);
  }

  amountInlandColumn(props?: any) {
    return Object.assign({}, this.amountInland, props);
  }

  amountExpressColumn(props?: any) {
    return Object.assign({}, this.amountExpress, props);
  }
}
