import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartService } from '../../service/cart.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { CartHistoryModel } from './cart-history.model';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-history-modal.component.html'
})
export class CartHistoryModalComponent implements OnInit {
  @Input() cartNumber;
  loading: boolean = false;
  rows = new Array<CartHistoryModel>();
  columns: any = [];
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  constructor(private dialogRef: MdDialogRef<CartHistoryModalComponent>,
              private cartService: CartService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) {
              }

  ngOnInit(): void {
    this.loading = true;
    this.loadPage();

    this.columns = [
      {
        name: this.translate.instant('date'),
        prop: 'date',
        width: 175,
        sortable: false,
      },
      {
        name: this.translate.instant('state'),
        prop: 'stateName',
        width: 135,
        sortable: false,
      },
      {
        name: this.translate.instant('user'),
        prop: 'user',
        width: 200,
        sortable: false,
      },
      {
        name: this.translate.instant('name'),
        prop: 'userFullname',
        width: 200,
        sortable: false,
      },
      {
        name: this.translate.instant('comment'),
        prop: 'comment',
        width: 300,
        sortable: false,
      },

    ];

  }

  loadPage() {
    this.loading = true;
    this.cartService
      .getHistory(this.cartNumber)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          list => this.bindOnSuccess(list),
          err => this.notificationBar.error(err)
        );
  }

  bindOnSuccess(list) {
    this.rows = list;
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

}
