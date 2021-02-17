import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { CashRegisterService } from '../../service/cash-register.service';

import { TranslateService } from '../../../core/translate/translate.service';
import { CashRegisterModel } from '../../model/cash-register-action.model';
import { CashRegisterFormComponent } from '../cash-register-form/cash-register-form.component';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  selector: 'cash-register-description-modal',
  templateUrl: 'cash-register-description-modal.component.html'
})
export class CashRegisterDescriptionModalComponent implements OnInit  {
  cashRegisterId: number;
  cashRegister: any;
  title: string;
  isOpening: boolean;
  loading: boolean = false;
  pointOfSale: string;
  hasDetail: boolean;
  onSaveSuccess: Function;
  @ViewChild('cashRegisterForm') cashRegisterForm: CashRegisterFormComponent;

  translateMessages =  {
    openingTitle: this.translate.instant('cash register opening'),
    closingTitle: this.translate.instant('cash register closing')
  };

  constructor(private dialogRef: MdDialogRef<CashRegisterDescriptionModalComponent>,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private cashRegisterService: CashRegisterService) {
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('50%');
  }

  public loadCashRegiter(): void {
    this.loading = true;

    this.cashRegisterService
      .getCashRegister(this.cashRegisterId)
      .finally(() => this.loading = false)
      .subscribe(
        (cashRegister) => {
          this.setCashRegister(cashRegister);
        },
        (err) => {
          this.notificationBar.error(err);
        }
      );
  }

  setCashRegister(cashRegister: any): void {
    this.isOpening = 'Abrir Caja' === cashRegister.operation;
    this.title = this.isOpening ? this.translateMessages.openingTitle : this.translateMessages.closingTitle;
    this.pointOfSale = cashRegister.pointOfSaleDescription;
    const accumulated = cashRegister.cashAmount + cashRegister.cardAmount + cashRegister.checkAmount + cashRegister.depositAmount;
    this.hasDetail = accumulated > 0;
    this.cashRegister = cashRegister;
  }

  onCancel() {
    this.dialogRef.close();
  }

  doSave(): void {
    this.onSave(this.cashRegisterForm.getCashRegister());
  }

  onSave(editedCashRegister: CashRegisterModel) {
    this.loading = true;

    const cashRegister = new CashRegisterModel();
    cashRegister.cashRegisterId = this.cashRegisterId;
    cashRegister.description = editedCashRegister.description;
    cashRegister.cashAmount = editedCashRegister.cashAmount;
    cashRegister.cardAmount = editedCashRegister.cardAmount;
    cashRegister.checkAmount = editedCashRegister.checkAmount;
    cashRegister.depositAmount = editedCashRegister.depositAmount;

    this.cashRegisterService
      .updateCashRegister(cashRegister)
      .finally(() => this.loading = false)
      .subscribe(
        (data) => {
          this.loading = false;
          this.notificationBar.success('cash register updated with success');

          if (this.onSaveSuccess) {
            this.onSaveSuccess();
          }

          this.dialogRef.close();
        },
        (err) => {
          this.notificationBar.error(err);
        }
      );
  }
}
