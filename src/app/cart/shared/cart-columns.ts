import { Injectable } from '@angular/core';
import { DataTableCurrencyPipe } from '../../shared/pipes/data-table-currency-pipe';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class CartColumns {
  private cartNumber: any;
  private registerDate: any;
  private stateDate: any;
  private totalAmount: any;
  private location: any;
  private username: any;
  private paymentStateId: any;
  private assigneeName: any;

  constructor(private translate: TranslateService) {

    this.cartNumber = {
      name: this.translate.instant('cart number'),
      prop: 'cartNumber',
      width: 85,
      sortable: true,
      cellClass: 'u-textRight Cell--strechSidePadding',
      headerClass: 'u-textRight Cell--strechSidePadding'
    };

    this.registerDate = {
      name: this.translate.instant('register date'),
      prop: 'registerDate',
      width: 105,
      sortable: true,
      cellClass: 'u-textRight Cell--strechSidePadding',
      headerClass: 'u-textRight Cell--strechSidePadding'
    };

    this.stateDate = {
      name: this.translate.instant('state date'),
      prop: 'stateDate',
      width: 105,
      sortable: true,
      cellClass: 'u-textRight Cell--strechSidePadding',
      headerClass: 'u-textRight Cell--strechSidePadding'
    };

    this.totalAmount = {
      name: this.translate.instant('amount'),
      prop: 'totalAmount',
      width: 105,
      sortable: true,
      pipe: new DataTableCurrencyPipe(),
      cellClass: 'u-textRight Cell--strechSidePadding',
      headerClass: 'u-textRight Cell--strechSidePadding'
    };

    this.location = {
      name: this.translate.instant('location|short'),
      prop: 'location',
      width: 85,
      sortable: false
    };

    this.username = {
      name: this.translate.instant('user'),
      prop: 'username',
      width: 245,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };

    this.assigneeName = {
      name: this.translate.instant('assignee'),
      prop: 'assigneeName',
      width: 300,
      sortable: false,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };
  }

  cartNumberColumn(props?: any) {
    return Object.assign({}, this.cartNumber, props);
  }

  registerDateColumn(props?: any) {
    return Object.assign({}, this.registerDate, props);
  }

  stateDateColumn(props?: any) {
    return Object.assign({}, this.stateDate, props);
  }

  totalAmountColumn(props?: any) {
    return Object.assign({}, this.totalAmount, props);
  }

  locationColumn(props?: any) {
    return Object.assign({}, this.location, props);
  }

  usernameColumn(props?: any) {
    return Object.assign({}, this.username, props);
  }

  paymentStateIdColumn(props?: any) {
    return Object.assign({}, this.paymentStateId, props);
  }

  assigneeNameColumn(props?: any) {
    return Object.assign({}, this.assigneeName, props);
  }
}
