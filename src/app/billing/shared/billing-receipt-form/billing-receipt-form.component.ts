import { Component, OnInit, Output, Input, EventEmitter, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../../core/translate/translate.service';
import { ReceiptModel } from '../../model/billing-receipt.model';
import { CartSelectorService } from '../../../shared/cart-selector';
import { TicketSelectorService } from '../../../shared/ticket-selector';
import { ClientSelectorService } from '../../../shared/client-selector';

const amountValidationRegex = /^[+]?\d+(\.\d{1,2})?$/;
@Component({
  moduleId: module.id,
  selector: 'billing-receipt-form',
  templateUrl: 'billing-receipt-form.component.html'
})
export class BillingReceiptFormComponent implements OnInit {
  @Output() onSubmitForm = new EventEmitter<ReceiptModel>();
  @Input() receipt: ReceiptModel;
  @Input() allowEditAmount = true;
  frmReceipt: FormGroup;
  cashAmount = 0;
  cardAmount = 0;
  checkAmount = 0;
  depositAmount = 0;
  totalAmount: string;
  clientId = 0;
  clientName = '';
  ticketId = 0;
  cartId = 0;

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              public renderer: Renderer,
              private cartSelector: CartSelectorService,
              private ticketSelector: TicketSelectorService,
              private clientSelector: ClientSelectorService,
            ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const receipt = this.receipt || (this.receipt = new ReceiptModel());
    this.cashAmount = receipt.cashAmount || 0;
    this.cardAmount = receipt.cardAmount || 0;
    this.checkAmount = receipt.checkAmount || 0;
    this.depositAmount = receipt.depositAmount || 0;

    this.updateTotalAmount();

    this.frmReceipt = this.fb.group({
      description: [receipt.description],
      cashAmount: [this.formatAmmount(receipt.cashAmount),
        [Validators.required, Validators.pattern(amountValidationRegex)]],
      cardAmount: [this.formatAmmount(receipt.cardAmount),
        [Validators.required, Validators.pattern(amountValidationRegex)]],
      checkAmount: [this.formatAmmount(receipt.checkAmount),
        [Validators.required, Validators.pattern(amountValidationRegex)]],
      depositAmount: [this.formatAmmount(receipt.depositAmount),
        [Validators.required, Validators.pattern(amountValidationRegex)]],
    });

    if (receipt.clientId) {
      this.clientId = receipt.clientId;
      this.clientName = receipt.clientName;
    }

    if (receipt.ticketId) {
      this.ticketId = receipt.ticketId;
    }

    if (receipt.cartId) {
      this.cartId = receipt.cartId;
    }
  }

  private formatAmmount(amount) {
    if (amount) {
      return amount.toFixed(2);
    }
    return '0.00';
  }

  canSubmit(): boolean {
    return this.frmReceipt.valid && !!this.clientId;
  }

  onSubmit(): void {
    this.onSubmitForm.emit(this.getReceipt());
  }

  getReceipt(): ReceiptModel {
    this.receipt.description = this.frmReceipt.get('description').value;
    this.receipt.cashAmount = this.frmReceipt.get('cashAmount').value;
    this.receipt.cardAmount = this.frmReceipt.get('cardAmount').value;
    this.receipt.checkAmount = this.frmReceipt.get('checkAmount').value;
    this.receipt.depositAmount = this.frmReceipt.get('depositAmount').value;
    this.receipt.clientId = this.clientId;
    this.receipt.ticketId = this.ticketId;
    this.receipt.cartId = this.cartId;

    return this.receipt;
  }

  onAmountChange($event, key): void {
    this[key] = parseFloat($event.target.value);
    this.updateTotalAmount();
  }

  updateTotalAmount(): void {
    this.totalAmount = (this.cashAmount + this.cardAmount + this.checkAmount + this.depositAmount).toFixed(2);
  }

  searchCart() {
    this.cartSelector.select({
      filter: {
        clientId: this.clientId
      },
      multipleSelection: false
    }).subscribe(result => {
      if (result && result.doAction) {
        const { cartNumber, user, name, lastname } = result.selected[0];
        this.cartId = cartNumber;
        this.selectClient(user, name, lastname);
      }
    });
    return false;
  }

  removeCart() {
    this.cartId = 0;
  }

  searchTicket() {
    this.ticketSelector.select({
      filter: {
        clientId: this.clientId
      },
      multipleSelection: false
    }).subscribe(result => {
      if (result && result.doAction) {
        const { ticketNumber, user, name, lastname } = result.selected[0];
        this.ticketId = ticketNumber;
        this.selectClient(user, name, lastname);
      }
    });
    return false;
  }

  removeTicket() {
    this.ticketId = 0;
  }

  searchClient() {
    this.clientSelector.select({
      multipleSelection: false
    }).subscribe(result => {
      if (result && result.doAction) {
        const { clientNumber, name, lastname } = result.selected[0];
        this.selectClient(clientNumber, name, lastname);
      }
    });
    return false;
  }

  selectClient(id, name, lastname) {
    this.clientId = id;
    this.clientName = name + ' ' + lastname;
}

  removeClient() {
    this.clientId = 0;
    this.clientName = '';

    this.removeCart();
    this.removeTicket();
  }
}
