import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MdDialog, MdDialogConfig } from '@angular/material';


import * as moment from 'moment';

import { Page } from '../../shared/models/page.model';
import { CashRegisterCheckerListItem } from '../model/cash-register-cheker-list-item.model';
import { CashRegisterService } from '../service/cash-register.service';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';

import { DataTableCurrencyPipe } from '../../shared/pipes/data-table-currency-pipe';

import { PageLoaderService } from '../../shared/page-loader-service';

import { CashRegisterDetailModalComponent } from '../shared/cash-register-detail-modal/cash-register-detail-modal.component';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  moduleId: module.id,
  templateUrl: 'cash-register-checker-list.component.html',
  styles: [`
    .log-list-container {
      margin: 36px;
    }
  `]
})

export class CashRegisterCheckerListComponent implements OnInit {
  @ViewChild('viewDetailCellTemplate') viewDetailCellTemplate: TemplateRef<any>;

  loading: boolean = false;
  page = new Page();
  rows = new Array<CashRegisterCheckerListItem>();
  columns: any = [];

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
    // Footer total message
    totalMessage: this.translate.instant('total')
  };

  // filters
  machinePos: PointOfSaleModel = null;
  dateFrom = new FormControl();
  dateTo = new FormControl();

  constructor(private cashRegisterService: CashRegisterService,
              private pointOfSaleService: PointOfSaleService,
              private route: ActivatedRoute,
              private notificationBar: NotificationBarService,
              private dialogRef: MdDialog,
              private pageLoaderService: PageLoaderService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
  }

  ngOnInit() {
    this.clearSearchForm();
    this.initPointsOfSale();

    this.columns = [
      // { name: this.translate.instant('point of sale'), prop: 'pointOfSaleName' , width: 230, sortable: false },
      { name: this.translate.instant('opening date'), prop: 'openingDate' , width: 165, sortable: false },
      { name: this.translate.instant('operation'), prop: 'openingOperationDesc', width: 120, sortable: false }, // frozenLeft: true },
      { name: this.translate.instant('userName'), prop: 'openingUserName', width: 230, sortable: false },
      { name: this.translate.instant('amount'), prop: 'openingAmount', width: 130, sortable: false, pipe: new DataTableCurrencyPipe() },
      { name: this.translate.instant('closure date'), prop: 'closureDate' , width: 165, sortable: false },
      { name: this.translate.instant('operation'), prop: 'closureOperationDesc', width: 120, sortable: false }, // frozenLeft: true },
      { name: this.translate.instant('userName'), prop: 'closureUserName', width: 230, sortable: false },
      { name: this.translate.instant('amount'), prop: 'closureAmount', width: 130, sortable: false, pipe: new DataTableCurrencyPipe() },
      { name: this.translate.instant('view detail'), prop: 'closureCashRegisterId', width: 180, sortable: false,
        cellTemplate: this.viewDetailCellTemplate, cellClass: 'Cell--button' },
    ];
  }

  clearSearchForm(): void {
    // Datelimits
    const momentDateLocalNow = moment().local();
    momentDateLocalNow.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    const momentDateLocalStartOfWeek = moment().local();
    momentDateLocalStartOfWeek.set({hour: 0, minute: 0, second: 0, millisecond: 0});

    this.page.filters.from = momentDateLocalStartOfWeek.isoWeekday(1).toDate();
    this.page.filters.to = momentDateLocalNow.toDate();

    // Set Form Controls
    this.dateFrom.setValue(this.page.filters.from);
    this.dateFrom.markAsPristine();
    this.dateTo.setValue(this.page.filters.to);
    this.dateTo.markAsPristine();
  }

  // Loading??
  initPointsOfSale(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.pointOfSaleService.getPointOfSale()
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe((pos: PointOfSaleModel) => {
         this.machinePos = pos;
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

  viewDetail(cashRegisterId: number): void {
    const config = new MdDialogConfig();

    const dialogRef = this.dialogRef.open(CashRegisterDetailModalComponent, config);
    dialogRef.componentInstance.cashRegisterId = cashRegisterId;
    dialogRef.componentInstance.pointOfSaleName = this.machinePos.name;
    dialogRef.componentInstance.loadCashRegiter();
  }

  canSearch(): boolean {
    return this.machinePos !== null; // && this.machinePos.hasCashRegister;
  }

  onSearch(): void {
    this.loading = true;
    this.page.pageNumber = 0;
    this.page.filters.pointOfSaleId = this.machinePos.pointOfSaleId;
    this.page.filters.from = this.dateFrom.value;
    this.page.filters.to = this.dateTo.value;

    this.cashRegisterService
      .getCashRegisterCheckerList(this.page)
        .finally(() => { this.loading = false; })
        .subscribe(
          pagedData => this.bindOnSuccess(pagedData),
          err => this.notificationBar.error(err)
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
      .getCashRegisterCheckerList(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          pagedData => this.bindOnSuccess(pagedData),
          err => this.notificationBar.error(err)
        );
  }

  bindOnSuccess(pagedData) {
    this.page = pagedData.page;
    this.rows = pagedData.data;
  }
}
