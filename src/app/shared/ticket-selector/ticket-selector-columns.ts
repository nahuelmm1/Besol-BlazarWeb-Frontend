import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';
import { DataTableCurrencyPipe } from '../pipes/data-table-currency-pipe';

@Injectable()
export class TicketSelectorColumns {
  private ticketNumber: any;
  private date: any;
  private name: any;
  private lastname: any;
  private user: any;
  private pointOfSale: any;
  private amount: any;

  constructor(private translate: TranslateService) {
    this.ticketNumber = {
      name: this.translate.instant('voucher number'),
      prop: 'ticketNumber',
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

    this.name = {
      name: this.translate.instant('name'),
      prop: 'name',
      width: 250,
      sortable: true
    };

    this.lastname = {
      name: this.translate.instant('lastname'),
      prop: 'lastname',
      width: 250,
      sortable: true
    };

    this.user = {
      name: this.translate.instant('user'),
      prop: 'user',
      width: 145,
      sortable: true,
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };

    this.pointOfSale = {
      name: this.translate.instant('point of sale'),
      prop: 'pointOfSale',
      width: 210,
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
  }

  ticketNumberColumn(props?: any) {
    return Object.assign({}, this.ticketNumber, props);
  }

  dateColumn(props?: any) {
    return Object.assign({}, this.date, props);
  }

  nameColumn(props?: any) {
    return Object.assign({}, this.name, props);
  }

  lastnameColumn(props?: any) {
    return Object.assign({}, this.lastname, props);
  }

  userColumn(props?: any) {
    return Object.assign({}, this.user, props);
  }

  pointOfSaleColumn(props?: any) {
    return Object.assign({}, this.pointOfSale, props);
  }

  amountColumn(props?: any) {
    return Object.assign({}, this.amount, props);
  }
}
