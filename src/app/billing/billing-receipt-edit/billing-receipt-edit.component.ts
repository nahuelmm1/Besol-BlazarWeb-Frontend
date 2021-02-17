import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BillingService } from '../service/billing.service';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { BillingColumns } from '../shared/billing-columns';
import { ReceiptModel } from '../model/billing-receipt.model';
import { PageLoaderService } from '../../shared/page-loader-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { CashRegisterService } from '../../cash-register/service/cash-register.service';
import { CashRegisterStateModel } from '../../cash-register/model/cash-register-state.model';
import { LocalStorageService } from '../../shared/local-storage.service';
import { BillingReceiptFormComponent } from '../shared/billing-receipt-form/billing-receipt-form.component';

@Component({
  moduleId: module.id,
  templateUrl: 'billing-receipt-edit.component.html'
})

export class BillingReceiptEditComponent implements OnInit {
  @ViewChild('receiptForm') receiptForm: BillingReceiptFormComponent;
  receipt: ReceiptModel;
  hasReceipt: boolean;
  canOpenCashRegister: boolean = false;

  constructor(
              private billingService: BillingService,
              private fb: FormBuilder,
              private pageLoaderService: PageLoaderService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private billingColumns: BillingColumns,
              private router: Router,
              private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private confirmService: ConfirmDialogueService,
              private auth: AuthService,
              private cashRegisterService: CashRegisterService,
              private pofService: PointOfSaleService) {
  }

  ngOnInit(): void {
    this.hasReceipt = false;
    this.canOpenCashRegister = this.localStorageService.getUserData().authorization.canOpenCashRegister;
    this.pageLoaderService.setPageLoadingStatus(true);
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        return this.billingService.getReceipt(parseInt(params.get('id'), 10));
      })
      .subscribe(
        (receipt) => {
          this.receipt = receipt;
          setTimeout(() => this.hasReceipt = true, 0); // prevent issue ExpressionChangedAfterItHasBeenCheckedError
          this.pageLoaderService.setPageLoadingStatus(false);
          this.checkCashRegisterState(receipt.pointOfSaleId);
        },
        (err) => {
          this.notificationBar.error(err);
          this.pageLoaderService.setPageLoadingStatus(false);
        }
      );
  }

  checkCashRegisterState(pointOfSaleId: number): void {
    this.cashRegisterService.getCashRegisterState(pointOfSaleId)
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

  onUpdate(receipt: ReceiptModel): void {
    if (this.receiptForm.canSubmit()) {
      this.pageLoaderService.setPageLoadingStatus(true);

      this.billingService.updateReceipt(receipt)
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe(
        (receiptId: number) => {
          this.notificationBar.success('receipt updated with success');
          this.onReceiptUpdated(receiptId);
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

  onReceiptUpdated(receiptId: number): void {
    const confirmOpts = {
      contentMessage: this.translate.instant('do you want to print the receipt'),
      titleMessage: this.translate.instant('receipt updated'),
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

  getPointOfSaleDescription() {
    return this.receipt && this.receipt.pointOfSaleName;
  }

  onCancel() {
    this.router.navigate(['/billing/receipt']);
  }

  doUpdate(): void {
    this.onUpdate(this.receiptForm.getReceipt());
  }

  canUpdate(): boolean {
    return this.hasReceipt && this.receiptForm.canSubmit();
  }
}
