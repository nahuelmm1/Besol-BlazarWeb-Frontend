import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../../core/translate/translate.service';
import { CashRegisterModel } from '../../model/cash-register-action.model';

const amountValidationRegex = /^[+]?\d+(\.\d{1,2})?$/;
@Component({
  moduleId: module.id,
  selector: 'cash-register-form',
  templateUrl: 'cash-register-form.component.html'
})
export class CashRegisterFormComponent implements OnInit, AfterViewInit {
  @ViewChild('iptamount') inputAmmount: ElementRef;
  @ViewChild('iptdescription') inputDescription: ElementRef;
  @Output() onSubmitForm = new EventEmitter<CashRegisterModel>();
  @Input() cashRegister: CashRegisterModel;
  @Input() allowEditAmount: boolean = true;
  frmCashRegister: FormGroup;
  cashAmount: number = 0;
  cardAmount: number = 0;
  checkAmount: number = 0;
  depositAmount: number = 0;
  totalAmount: string;

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              public renderer: Renderer) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const focusTarget = this.allowEditAmount ? this.inputAmmount : this.inputDescription;
      this.renderer.invokeElementMethod(focusTarget.nativeElement, 'focus', []);
    }, 100);
  }

  initForm(): void {
    const cashRegister = this.cashRegister || new CashRegisterModel();
    this.cashAmount = cashRegister.cashAmount || 0;
    this.cardAmount = cashRegister.cardAmount || 0;
    this.checkAmount = cashRegister.checkAmount || 0;
    this.depositAmount = cashRegister.depositAmount || 0;

    this.updateTotalAmount();

    this.frmCashRegister = this.fb.group({
      description: [cashRegister.description],
      cashAmount: [{
          value: this.formatAmmount(cashRegister.cashAmount),
          disabled: !this.allowEditAmount
        },
        [Validators.required, Validators.pattern(amountValidationRegex)]],
      cardAmount: [{
          value: this.formatAmmount(cashRegister.cardAmount),
          disabled: !this.allowEditAmount
        },
        [Validators.required, Validators.pattern(amountValidationRegex)]],
      checkAmount: [{
          value: this.formatAmmount(cashRegister.checkAmount),
          disabled: !this.allowEditAmount
        },
        [Validators.required, Validators.pattern(amountValidationRegex)]],
      depositAmount: [{
          value: this.formatAmmount(cashRegister.depositAmount),
          disabled: !this.allowEditAmount
        },
        [Validators.required, Validators.pattern(amountValidationRegex)]]
    });
  }

  private formatAmmount(amount) {
    if (amount) {
      return amount.toFixed(2);
    }
    return '0.00';
  }

  canSubmit(): boolean {
    return this.frmCashRegister.valid;
  }

  onSubmit(): void {
    this.onSubmitForm.emit(this.getCashRegister());
  }

  getCashRegister(): CashRegisterModel {
    const cashRegister = new CashRegisterModel();
    cashRegister.cashAmount = this.frmCashRegister.get('cashAmount').value;
    cashRegister.cardAmount = this.frmCashRegister.get('cardAmount').value;
    cashRegister.checkAmount = this.frmCashRegister.get('checkAmount').value;
    cashRegister.depositAmount = this.frmCashRegister.get('depositAmount').value;
    cashRegister.description = this.frmCashRegister.get('description').value;
    return cashRegister;
  }

  onAmountChange($event, key): void {
    this[key] = parseFloat($event.target.value);
    this.updateTotalAmount();
  }

  updateTotalAmount(): void {
    this.totalAmount = (this.cashAmount + this.cardAmount + this.checkAmount + this.depositAmount).toFixed(2);
  }
}
