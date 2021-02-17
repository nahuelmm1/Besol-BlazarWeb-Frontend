import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartDetailModel } from '../../model/cart-detail.model';
import { CartService } from '../../service/cart.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { Province } from '../../../shared/models/province.model';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-download-attached-orders-modal.component.html',
  styleUrls: ['./cart-detail-download-attached-orders-modal.component.scss']
})
export class CartDetailDownloadAttachedOrdersModalComponent implements OnInit {
  @Input() cart: CartDetailModel;
  attachedCarts:any[];

  constructor(private dialogRef: MdDialogRef<CartDetailDownloadAttachedOrdersModalComponent>,
              private cartService: CartService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) { }

  ngOnInit() {
    this.cartService.getAttachedCartsId(this.cart.cartNumber).subscribe(
      (list) => {
        this.attachedCarts = list.map(function(x){
          return {"value":x,"checked":false}
        });
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );
  }

  onCheckItem(event:Event,item:any){
    let index = this.attachedCarts.findIndex(x => x.value == item.value );
    this.attachedCarts[index].checked = (<HTMLInputElement>event.target).checked;
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({
      doAction: true,
      pendingIdsForDownloading: this.attachedCarts.filter(x => x.checked).map(x => x.value)
    });
  }

}
