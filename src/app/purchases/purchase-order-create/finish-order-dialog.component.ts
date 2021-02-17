import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../core/translate';
import { CartBrandModel } from '../../cart/model/cart-brand.model';
import { FormControl } from '@angular/forms';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'finish-order-dialog',
  templateUrl: 'finish-order-dialog.component.html',
})
export class FinishOrderDialogComponent implements OnInit {

  brand: CartBrandModel = undefined;
  @Input() storesId: number[];
  message = new FormControl();

  constructor(private dialogRef: MdDialogRef<FinishOrderDialogComponent>,
              private purchaseOrderService: PurchaseOrderService,
              private notificationBar: NotificationBarService,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit(): void {
    if (this.brand === undefined) {
      this.brand = new CartBrandModel();
      this.brand.name = this.translate.instant("undefined");
    }
  }

  cancel(): void {
    this.router.navigate(['/purchases/purchaseOrder']);
    this.dialogRef.close({confirm: false});
  }

  confirm(): void {
    this.purchaseOrderService.notifySupplier(
      this.brand.brandId, 
      this.message.value === null || this.message.value === undefined ? '' : this.message.value,
      this.storesId)
        .subscribe(resMail => {
            if (resMail.ok) {
              this.notificationBar.success('Mail enviado al proveedor');
            } else {
              this.notificationBar.error(resMail.blob.toString);
            }
          });
    this.router.navigate(['/purchases/purchaseOrder']);
    this.dialogRef.close({confirm: true});
  }

}