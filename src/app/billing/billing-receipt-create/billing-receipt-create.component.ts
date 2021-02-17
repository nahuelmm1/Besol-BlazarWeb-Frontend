import { Component, OnInit, ViewChild } from '@angular/core';

import { BillingService } from '../service/billing.service';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { BillingColumns } from '../shared/billing-columns';
import { ReceiptModel } from '../model/billing-receipt.model';
import { PageLoaderService } from '../../shared/page-loader-service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { BillingReceiptFormComponent } from '../shared/billing-receipt-form/billing-receipt-form.component';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { CashRegisterService } from '../../cash-register/service/cash-register.service';
import { CashRegisterStateModel } from '../../cash-register/model/cash-register-state.model';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  moduleId: module.id,
  templateUrl: 'billing-receipt-create.component.html'
})

export class BillingReceiptCreateComponent implements OnInit {
  @ViewChild('receiptForm') receiptForm: BillingReceiptFormComponent;
  receipt: ReceiptModel;

  // MachineInfo
  loadingPointOfSale = true;
  machinePos: PointOfSaleModel = null;
  canOpenCashRegister: boolean = false;

  constructor(
              private billingService: BillingService,
              private pageLoaderService: PageLoaderService,
              public notificationBar: NotificationBarService,
              private translate: TranslateService,
              private billingColumns: BillingColumns,
              private router: Router,
              private localStorageService: LocalStorageService,
              private confirmService: ConfirmDialogueService,
              private auth: AuthService,
              private cashRegisterService: CashRegisterService,
              private pofService: PointOfSaleService) {
  }

  ngOnInit(): void {
    this.canOpenCashRegister = this.localStorageService.getUserData().authorization.canOpenCashRegister;

    this.initPointOfSale();
  }

  onCreate(receipt: ReceiptModel): void {
    if (this.receiptForm.canSubmit()) {
      this.pageLoaderService.setPageLoadingStatus(true);

      receipt.pointOfSaleId = this.machinePos.pointOfSaleId;

      this.billingService.createReceipt(receipt)
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe(
        (receiptId: number) => {
          this.notificationBar.success('receipt created with success');
          this.onReceiptCreated(receiptId);
        },
        (err: string) => {
          if (err === 'ErrReceiptVendorNotFound') {
            this.auth.logout();
          } else {
            this.notificationBar.error(err);
          }
        }
      );
    }
  }

  onReceiptCreated(receiptId: number): void {
    const confirmOpts = {
      contentMessage: this.translate.instant('do you want to print the receipt'),
      titleMessage: this.translate.instant('receipt created'),
      cancelMessage: this.translate.instant('no'),
    };
    this.confirmService.confirm(confirmOpts).subscribe(result => {
      if (result && result.doAction) {
        this.pageLoaderService.setPageLoadingStatus(true);
        this.billingService.downloadReceipt(receiptId)
        .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
        .subscribe(
          () => {
            this.router.navigate(['/billing/receipt']);
          },
          (err: string) => {
            this.notificationBar.error(err);
          }
        );
        } else {
          this.router.navigate(['/billing/receipt']);
        }
    });
  }

  initPointOfSale(): void {
    this.loadingPointOfSale = true;
    this.pofService.getPointOfSale()
      .finally(() => this.loadingPointOfSale = false)
      .subscribe((pos: PointOfSaleModel) => {
        this.machinePos = pos;
        if (pos && !pos.hasCashRegister) {
          this.notificationBar.error('ErrPointOfSaleHasNoCashRegister');
        } else {
          this.checkCashRegisterState(pos);
        }
      },
      (err) => {
        let errType = 'snackError';
        let duration = 3500;
        if (err === 'ErrCashRegisterPointOfSaleNotFound') {
           errType = 'snackWarning';
           duration = 10000;
        }

        this.notificationBar.notify(this.translate.instant(err), duration, [errType]);
      });
  }

  checkCashRegisterState(pointOfSale: PointOfSaleModel): void {
    this.cashRegisterService.getCashRegisterState(pointOfSale.pointOfSaleId)
      .subscribe(
        (cashRegisterState: CashRegisterStateModel) => {
          if (!cashRegisterState.isOpened) {
            if (this.canOpenCashRegister) {
              this.promptGoOpenCashRegister();
            } else {
              this.onCancel();
              this.notificationBar.error('ErrReceiptCashRegisterIsNotOpened');
            }
          }
        },
        (err) => this.notificationBar.error(err)
      );
  }

  promptGoOpenCashRegister(): void {
    const actionMessage = this.translate.instant('open cash register');
    const contentMessage = `${this.translate.instant('ErrReceiptCashRegisterIsNotOpened')}
      ${this.translate.instant('if you wish to operate please open the cash register first')}`;

    this.confirmService.confirm({ contentMessage, actionMessage }).subscribe(result => {
      if (result && result.doAction) {
        this.router.navigate(['/cashregister/open']);
      } else {
        this.onCancel();
        this.notificationBar.error('ErrReceiptCashRegisterIsNotOpened');
      }
    });
  }

  getPointOfSaleDescription() {
    return this.machinePos && this.machinePos.name;
  }

  onCancel() {
    this.router.navigate(['/billing/receipt']);
  }

  doCreate(): void {
    this.onCreate(this.receiptForm.getReceipt());
  }

  canCreate(): boolean {
    return this.receiptForm.canSubmit();
  }
}
