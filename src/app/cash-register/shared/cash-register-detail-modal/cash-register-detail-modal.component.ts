import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { CashRegisterService } from '../../service/cash-register.service';

import { Page } from '../../../shared/models/page.model';
import { CashRegisterListItem } from '../../model/cash-register-list.model';
import { TranslateService } from '../../../core/translate/translate.service';
import { CashRegisterColumns } from '../cash-register-columns';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  selector: 'cash-register-detail-modal',
  templateUrl: 'cash-register-detail-modal.component.html'
})
export class CashRegisterDetailModalComponent implements OnInit  {
  cashRegisterId: number;
  pointOfSaleName: string;
  page = new Page();
  loading: boolean = false;
  rows = new Array<CashRegisterListItem>();
  columns: any = [];

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
    // Footer total message
    totalMessage: this.translate.instant('total')
  };

  constructor(private dialogRef: MdDialogRef<CashRegisterDetailModalComponent>,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private cashRegisterColumns: CashRegisterColumns,
              private cashRegisterService: CashRegisterService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.columns = [
      this.cashRegisterColumns.dateColumn(),
      this.cashRegisterColumns.operationColumn(),
      this.cashRegisterColumns.voucherNumberColumn(),
      this.cashRegisterColumns.userNameColumn(),
      this.cashRegisterColumns.amountColumn(),
      this.cashRegisterColumns.amountInlandColumn(),
      this.cashRegisterColumns.amountExpressColumn(),
    ];
    this.dialogRef.updateSize('80%');
  }

  public loadCashRegiter(): void {
    this.loading = true;
    this.page.pageNumber = 0;
    this.page.filters.cashRegisterId  = this.cashRegisterId;

    this.cashRegisterService
      .getCashRegisterDetail(this.page)
      .finally(() => this.loading = false)
      .subscribe(
        (pagedData) => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        },
        (err) => {
          this.notificationBar.error(err);
        }
      );
  }

  /**
  * Populate the table with new data based on the page number
  * @param page The page to select
  */
  setPage(pageInfo) {
    this.loading = true;
    this.page.pageNumber = pageInfo.offset;

    this.cashRegisterService
      .getCashRegisterDetail(this.page)
      .finally(() => this.loading = false)
      .subscribe(
        (pagedData) => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        },
        (err) => {
          this.notificationBar.error(err);
        }
      );
  }

  getRowClass(row): any {
    return {
      'open-close-row': row.isOpening() || row.isClosing()
    };
  }

  onCancel() {
    this.dialogRef.close();
  }
}
