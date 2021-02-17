import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';
import { ClientStatsPaymentModel } from './client-stats-payment.model';
import { TranslateService } from '../../core/translate';

@Component({
  moduleId: module.id,
  templateUrl: 'client-stats-payments.component.html',
  selector: 'bla-client-stats-payments',
  styles: ['./client-stats-payments.component.scss']
})

export class ClientStatsPaymentsComponent implements OnInit {
  @ViewChild('stateCellTemplate') stateCellTemplate: TemplateRef<any>;

  @Input() loading: boolean = false;
  @Input() payments: Array<ClientStatsPaymentModel> = [];

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
        name: this.translate.instant('state'),
        prop: 'rejected',
        cellTemplate: this.stateCellTemplate,
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('cart'),
        prop: 'cartId',
        width: 100,
        sortable: false,
        cellClass: 'u-textRight',
        headerClass: 'u-textRight'
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
        width: 300,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('transaction'),
        prop: 'transaction',
        width: 300,
        sortable: false,
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
