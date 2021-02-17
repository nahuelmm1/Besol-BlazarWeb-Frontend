import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { ClientStatsModel } from './client-stats.model';
import { ClientStatsService } from './client-stats.service';
import { ClientStatsPaymentModel } from './client-stats-payment.model';
import { ClientStatsCartModel } from './client-stats-cart.model';

@Component({
  moduleId: module.id,
  selector: 'client-stats-modal',
  templateUrl: 'client-stats-modal.component.html'
})
export class ClientStatsModalComponent implements OnInit {
  @Input() clientId: number;
  isLoading: boolean;
  client: ClientStatsModel;
  payments: Array<ClientStatsPaymentModel> = [];
  isLoadingPayments: boolean;
  carts: Array<ClientStatsCartModel> = [];
  isLoadingCarts: boolean;

  constructor(private dialogRef: MdDialogRef<ClientStatsModalComponent>,
              private translate: TranslateService,
              private clientStatsService: ClientStatsService
              ) { }

  ngOnInit() {
    this.isLoading = true;
    this.isLoadingPayments = true;
    this.isLoadingCarts = true;

    this.clientStatsService.getClient(this.clientId)
      .finally(() => this.isLoading = false)
      .subscribe((client) => this.client = client);

    this.clientStatsService.getPayments(this.clientId)
      .finally(() => this.isLoadingPayments = false)
      .subscribe((payments) => {this.payments = payments;
      });

    this.clientStatsService.getCarts(this.clientId)
      .finally(() => this.isLoadingCarts = false)
      .subscribe((carts) => this.carts = carts);
  }

  onClose() {
    this.dialogRef.close({ doAction: false});
  }
}
