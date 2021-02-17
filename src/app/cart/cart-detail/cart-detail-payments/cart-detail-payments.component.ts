import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';

import { TranslateService } from '../../../core/translate/translate.service';
import { CartDetailPaymentModel } from '../../model/cart-detail-payment.model';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-payments.component.html',
  selector: 'bla-cart-detail-payments'
})

export class CartDetailPaymentsComponent implements OnInit {
  @ViewChild('stateCellTemplate') stateCellTemplate: TemplateRef<any>;

  @Input() loading: boolean = false;
  @Input() payments: Array<CartDetailPaymentModel>;
  @Input() authorization: any;

  columns: any = [];
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  constructor(
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.columns = [
      {
        name: this.translate.instant('rejected'),
        prop: 'rejected',
        cellTemplate: this.stateCellTemplate,
        width: 50,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('verified'),
        prop: 'verified',
        cellTemplate: this.stateCellTemplate,
        width: 50,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('cart'),
        prop: 'cartNumber',
        width: 50,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('number|short'),
        prop: 'paymentId',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight',
        headerClass: 'u-textRight'
      },
      {
        name: this.translate.instant('bank'),
        prop: 'bank',
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('transaction'),
        prop: 'transaction',
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('amount'),
        prop: 'amount',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight',
        headerClass: 'u-textRight'
      },
    ];
  }

}
