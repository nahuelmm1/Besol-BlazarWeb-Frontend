import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartService } from '../../service/cart.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { FormControl } from '@angular/forms';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-cancel-modal.component.html'
})
export class CartDetailCancelModalComponent implements OnInit {
  isLoading: boolean;
  reasons: any[];
  selectedReason = new FormControl();
  comment = new FormControl();

  constructor(private dialogRef: MdDialogRef<CartDetailCancelModalComponent>,
              private cartService: CartService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) { }

  ngOnInit(): void {
    this.loadReasons();
    this.selectedReason.setValue('');
    this.selectedReason.markAsPristine();
    this.comment.setValue('');
    this.comment.markAsPristine();
  }

  loadReasons(): void {
    this.cartService.getCancelReasons().subscribe(
      (reasons) => {
        this.reasons = reasons;
        this.selectedReason.setValue(1);
      },
      (err) => {
        this.notificationBar.error(err);
      }
  );
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({
      doAction: true,
      reasonId: this.selectedReason.value,
      comment: this.comment.value
    });
  }
}
