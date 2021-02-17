import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as moment from 'moment';

import { BillingService } from '../service/billing.service';
import { Page } from '../../shared/models/page.model';
import { BillingReceiptListItem } from '../model/billing-receipt-list.model';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { BillingColumns } from '../shared/billing-columns';
import { Router } from '@angular/router';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../shared/page-loader-service';

@Component({
  moduleId: module.id,
  templateUrl: 'billing-receipt-list.component.html',
  styles: [`
    .log-list-container {
      margin: 36px;
    }
  `]
})

export class BillingReceiptListComponent implements OnInit {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<BillingReceiptListItem>();
  columns: any = [];
  defaultSortType = 'date';
  defaultSortDirection = 'desc';
  selectedReceipts: Array<BillingReceiptListItem> = [];
  getRowClassBound: Function;
  canDeleteReceipt: boolean = false;

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  pointOfSale = new FormControl();
  pointsOfSale: Array<PointOfSaleModel> = [];
  dateFrom = new FormControl();
  dateTo = new FormControl();
  vaucherNumber = new FormControl();
  userName = new FormControl();
  sellerName = new FormControl();
  amountFrom = new FormControl();
  amountTo = new FormControl();

  // MachineInfo
  machinePos: PointOfSaleModel;

  constructor(
              private billingService: BillingService,
              private pageLoaderService: PageLoaderService,
              private notificationBar: NotificationBarService,
              private router: Router,
              private confirmService: ConfirmDialogueService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService,
              private billingColumns: BillingColumns,
              private pofService: PointOfSaleService) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.getRowClassBound = this.getRowClass.bind(this);
  }

  ngOnInit(): void {
    this.clearSearchForm();
    this.initPointsOfSale();

    this.canDeleteReceipt = this.localStorageService.getUserData().authorization.canDeleteReceipt;

    this.columns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 50,
        sortable: false
      },
      this.billingColumns.voucherNumberColumn(),
      this.billingColumns.dateColumn(),
      this.billingColumns.userNameColumn(),
      this.billingColumns.amountColumn(),
      this.billingColumns.pointOfSaleNameColumn(),
      this.billingColumns.sellerNameColumn(),
    ];
  }

  clearSearchForm(): void {
    // Point of sale combo
    this.page.filters.pointOfSaleId = -1;

    // Datelimits
    const momentDateLocal = moment().local();
    momentDateLocal.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    this.page.filters.to = momentDateLocal.toDate();
    this.page.filters.from = momentDateLocal.add(-1, 'w').toDate();

    // Set Form Controls
    this.pointOfSale.setValue(this.page.filters.pointOfSaleId);
    this.pointOfSale.markAsPristine();
    this.dateFrom.setValue(this.page.filters.from);
    this.dateFrom.markAsPristine();
    this.dateTo.setValue(this.page.filters.to);
    this.dateTo.markAsPristine();
    this.vaucherNumber.setValue('');
    this.vaucherNumber.markAsPristine();
    this.userName.setValue('');
    this.userName.markAsPristine();
    this.sellerName.setValue('');
    this.sellerName.markAsPristine();
    this.amountFrom.setValue('');
    this.amountFrom.markAsPristine();
    this.amountTo.setValue('');
    this.amountTo.markAsPristine();
  }

  initPointsOfSale(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.pofService.getPointsOfSale()
      .switchMap((pointsOfSale: Array<PointOfSaleModel>) => {
        this.pointsOfSale = pointsOfSale;
        return this.pofService.getPointOfSale();
      })
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe((pos: PointOfSaleModel) => {
         this.machinePos = pos;
         this.pointOfSale.setValue(this.machinePos.pointOfSaleId);
         this.onSearch();
      },
      (err) => {
        if (err === 'ErrCashRegisterPointOfSaleNotFound') {
          this.notificationBar.warning(err);
        } else {
          this.notificationBar.error(err);
        }
      });
  }

  /**
  * Populate the table with new data based on the page number
  * @param page The page to select
  */
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadPage();
  }

  onSort(sortInfo) {
    this.page.filters.sortType = sortInfo.column.prop;
    this.page.filters.sortDirection = sortInfo.newValue;
    this.loadPage();
  }

  loadPage() {
    this.loading = true;
    this.billingService
      .getReceiptReport(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          pagedData => this.bindOnSuccess(pagedData),
          err => this.notificationBar.error(err)
        );
  }

  onSearch(): void {
    this.loading = true;
    this.page.pageNumber = 0;
    this.page.filters.pointOfSaleId = this.pointOfSale.value;
    this.page.filters.from = this.dateFrom.value;
    this.page.filters.to = this.dateTo.value;
    this.page.filters.vaucherNumber = this.vaucherNumber.value;
    this.page.filters.userName = this.userName.value;
    this.page.filters.sellerName = this.sellerName.value;
    this.page.filters.amountFrom = this.amountFrom.value;
    this.page.filters.amountTo = this.amountTo.value;

    this.resetSelected();

    this.loadPage();
  }

  bindOnSuccess(pagedData) {
    this.page = pagedData.page;
    this.rows = pagedData.data;
  }

  onCreate() {
    this.router.navigate(['/billing/receipt/create']);
  }

  handleActivate(activateInfo): void {
    if (activateInfo.type === 'click' && activateInfo.row) {
      this.toggleSelected(activateInfo.row);
    }
  }

  toggleSelected(receipt: BillingReceiptListItem): void {
    if (this.isSelected(receipt)) {
      this.selectedReceipts = this.selectedReceipts.filter(selected => selected.voucherNumber !== receipt.voucherNumber);
    } else {
      this.selectedReceipts = [ receipt ];
    }
  }

  isSelected(receipt: BillingReceiptListItem): boolean {
    return this.selectedReceipts.some((selected) => receipt.voucherNumber === selected.voucherNumber);
  }

  getRowClass(receipt: BillingReceiptListItem) {
    return {
      'selected-row': this.isSelected(receipt)
    };
  }

  resetSelected(): void {
    this.selectedReceipts = [];
  }

  hasSelection(): boolean {
    return this.selectedReceipts.length > 0;
  }

  onPrint() {
    this.loading = true;
    this.selectedReceipts.forEach((receipt) => {
      this.billingService.downloadReceipt(receipt.voucherNumber)
        .subscribe(
          () => {
            this.loading = false;
          },
          (err) => {
            this.loading = false;
            this.notificationBar.error(err);
          }
        );
    });
  }

  onDelete() {
    const confirmOpts = {
      contentMessage: this.translate.instant('are you sure you want to delete the receipt'),
      titleMessage: this.translate.instant('delete receipt'),
      cancelMessage: this.translate.instant('no'),
    };
    const receiptId = this.selectedReceipts[0].voucherNumber;

    this.confirmService.confirm(confirmOpts).subscribe(result => {
      if (result && result.doAction) {
        this.loading = true;
        this.billingService.deleteReceipt(receiptId)
        .subscribe(
          () => {
            this.resetSelected();
            this.loadPage();
            this.notificationBar.success('receipt deleted with success');
          },
          (err: string) => {
            this.loading = false;
            this.notificationBar.error(err);
          }
        );
      }
    });
  }

  onEdit() {
    const receiptId = this.selectedReceipts[0].voucherNumber;
    this.router.navigate(['/billing/receipt/edit', receiptId]);
  }
}
