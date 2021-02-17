import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { CashRegisterService } from '../service/cash-register.service';
import { TranslateService } from '../../core/translate/translate.service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { AuthService } from '../../shared/auth.service';

import { CashRegisterModel } from '../model/cash-register-action.model';

import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { CashRegisterFormComponent } from '../shared/cash-register-form/cash-register-form.component';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  templateUrl: 'cash-register-close.component.html'
})
export class CashRegisterCloseComponent implements OnInit, OnDestroy {
  @ViewChild('cashRegisterForm') cashRegisterForm: CashRegisterFormComponent;
  dialogueSubscription: Subscription;

  // MachineInfo
  loadingPointOfSale: boolean = true;
  machinePos: PointOfSaleModel = null;

  constructor(private cashRegisterService: CashRegisterService,
              private pofService: PointOfSaleService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private pageLoaderService: PageLoaderService,
              private confirmService: ConfirmDialogueService,
              private router: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.initPointOfSale();
  }

  ngOnDestroy(): void {
    if (this.dialogueSubscription) {
      this.dialogueSubscription.unsubscribe();
    }
  }

  initPointOfSale(): void {
    this.loadingPointOfSale = true;
    this.pofService.getPointOfSale()
      .finally(() => this.loadingPointOfSale = false)
      .subscribe((pos: PointOfSaleModel) => {
         this.machinePos = pos;
         if (pos && !pos.hasCashRegister) {
          this.notificationBar.error('ErrPointOfSaleHasNoCashRegister');
         }
      },
      (err) => {
        let errType = 'snackError';
        let duration = 3500;
        if (err === 'ErrCashRegisterPointOfSaleNotFound') {
           errType = 'snackWarning';
           duration = 10000;
        }

        this.notificationBar.notify(err, [errType], duration);
      });
  }

  canCloseCashRegister(): boolean {
    return this.cashRegisterForm.canSubmit() && this.isValidMachinePos();
  }

  getPointOfSaleDescription(): string {
    if (this.machinePos === null) {
      return this.translate.instant('ErrPointOfSaleNotFound');
    }

    if (this.isValidMachinePos()) {
      return this.machinePos.name;
    } else {
      return this.translate.instant('ErrPointOfSaleHasNoCashRegister');
    }
  }

  private isValidMachinePos(): boolean {
    return this.machinePos !== null && this.machinePos.hasCashRegister;
  }

  doCloseCashRegister(): void {
    this.onCloseCashRegister(this.cashRegisterForm.getCashRegister());
  }

  onCloseCashRegister(cashRegister: CashRegisterModel): void {
    this.pageLoaderService.setPageLoadingStatus(true);

    cashRegister.pointOfSale = this.machinePos;

    this.cashRegisterService
      .closeCashRegister(cashRegister)
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe(
        (cashRegisterId: number) => {
          this.notificationBar.success('cash register closed with success');
          this.router.navigate(['/cashregister/detail']);
        },
        (err: string) => {
          if (err === 'ErrCashRegisterOperationState') { // La caja ya esta abierta, redirigir a Cerrar
            this.showOperationNotValidDialogue();
          } else if (err === 'ErrCashRegisterVendorNotFound') {
            this.auth.logout();
          } else {
            this.notificationBar.error(err);
          }
        }
      );
  }

  showOperationNotValidDialogue(): void {
    const actionMessage = this.translate.instant('open cash register');
    const contentMessage = `${this.translate.instant('ErrCashRegisterClose')}
      ${this.translate.instant('if you wish to operate please open the cash register first')}`;

    this.confirmService.confirm({ contentMessage, actionMessage }).subscribe(result => {
      if (result && result.doAction) {
        this.router.navigate(['/cashregister/open']);
      }
    });
  }
}
