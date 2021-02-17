import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdDialogConfig, MdDialog } from '@angular/material';

import * as moment from 'moment';

import { CashRegisterService } from '../service/cash-register.service';
import { Page } from '../../shared/models/page.model';
import { CashRegisterListItem } from '../model/cash-register-list.model';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { CashRegisterModel } from '../model/cash-register-action.model';
import { PageLoaderService } from '../../shared/page-loader-service';
import { AuthService } from '../../shared/auth.service';
import { CashRegisterColumns } from '../shared/cash-register-columns';
import { CashRegisterDescriptionModalComponent } from '../shared/cash-register-description-modal/cash-register-description-modal.component';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  moduleId: module.id,
  templateUrl: 'cash-register-list.component.html',
  styles: [`
    .log-list-container {
      margin: 36px;
    }
  `]
})

export class CashRegisterListComponent implements OnInit {
  @ViewChild('dateCellTemplate') dateCellTemplate: TemplateRef<any>;
  @ViewChild('voucherCellTemplate') voucherCellTemplate: TemplateRef<any>;
  @ViewChild('actionCellTemplate') actionCellTemplate: TemplateRef<any>;
  @ViewChild('operationCellTemplate') operationCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<CashRegisterListItem>();
  columns: any = [];

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),

    // Footer total message
    totalMessage: this.translate.instant('total')
  };

  // filters
  pointOfSale = new FormControl();
  pointsOfSale: Array<PointOfSaleModel> = [];
  dateFrom = new FormControl();
  dateTo = new FormControl();
  verified = new FormControl('');
  verifiedFilter: Array<any> = [];

  // MachineInfo
  machinePos: PointOfSaleModel;

  constructor(private cashRegisterService: CashRegisterService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private confirmService: ConfirmDialogueService,
              private pageLoaderService: PageLoaderService,
              private auth: AuthService,
              private dialogRef: MdDialog,
              private cashRegisterColumns: CashRegisterColumns,
              private localStorageService: LocalStorageService,
              private pofService: PointOfSaleService) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.verifiedFilter = [{
        name: this.translate.instant('all'),
        id: ''
      }, {
        name: this.translate.instant('yes'),
        id: 'Y'
      }, {
        name: this.translate.instant('no'),
        id: 'N'
      }];
  }

  ngOnInit(): void {
    this.clearSearchForm();
    this.initPointsOfSale();

    this.columns = [
      this.cashRegisterColumns.dateColumn({ cellTemplate: this.dateCellTemplate, width: 157 }),
      this.cashRegisterColumns.operationColumn({ cellTemplate: this.operationCellTemplate, width: 140 }),
      this.cashRegisterColumns.voucherNumberColumn({ cellTemplate: this.voucherCellTemplate, width: 145 }),
      this.cashRegisterColumns.userNameColumn({ width: 240 }),
      this.cashRegisterColumns.amountColumn({ cellClass: (r) => this.getCellClass(r) }),
      this.cashRegisterColumns.amountInlandColumn(),
      this.cashRegisterColumns.amountExpressColumn(),
      { name: this.translate.instant('verified'), sortable: false, cellTemplate: this.actionCellTemplate, width: 130,
        cellClass: (r) => this.getActionCellClass(r)}
    ];
  }

  toggleFilter(showSearch: boolean) {
    if (!showSearch) { // && this.search.dirty && this.search.value !== '') {
      this.clearSearchForm();
      this.onSearch();
    }
  }

  clearSearchForm(): void {
    // Point of sale combo
    this.page.filters.pointOfSaleId = -1;

    // Datelimits
    const momentDateLocal = moment().local();
    momentDateLocal.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    this.page.filters.from = momentDateLocal.toDate();
    this.page.filters.to = momentDateLocal.toDate();

    // Set Form Controls
    this.pointOfSale.setValue(this.page.filters.pointOfSaleId);
    this.pointOfSale.markAsPristine();
    this.dateFrom.setValue(this.page.filters.from);
    this.dateFrom.markAsPristine();
    this.dateTo.setValue(this.page.filters.to);
    this.dateTo.markAsPristine();
  }

  initPointsOfSale(): void {
    this.pofService.getPointsOfSale()
      .switchMap((pointsOfSale: Array<PointOfSaleModel>) => {
        this.pointsOfSale = pointsOfSale;
        return this.pofService.getPointOfSale();
      })
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

  loadPage() {
    this.loading = true;
    this.cashRegisterService
      .getCashRegisterReport(this.page)
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
    this.page.filters.verified = this.verified.value;

    this.cashRegisterService
      .getCashRegisterReport(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          pagedData => this.bindOnSuccess(pagedData),
          err => this.notificationBar.error(err)
        );
  }

  getRowClass(row) {
    return {
      'open-row': row.isOpening(),
      'close-row': row.isClosing(),
      'total-row': row.isTotal(),
      'checked-row': !row.isOpening() && !row.isClosing() && !row.isTotal() && row.checked,
      'is-dispatched-row': (row.amountInland > 0 && row.operation === 'Factura' && !row.dispatched),
      'is-inland-ticket-row': (row.amountInland > 0 && row.operation === 'Ticket')
    };
  }

  getActionCellClass({ row }) {
    return {
      'Cell--action': row.isClosing() && row.checked,
      'Cell--button': row.isClosing() && !row.checked,
      'Cell--checkmark': !row.isClosing()
    };
  }

  // TODO: Ver de sacar las sumatorias y si el cierre da diferente, marcar la celda
  getCellClass({ row }): any {
    const isMarcable = row.isClosing() && row.$$index > 0;
    return {
      'balance-error': isMarcable && row.amount !== this.rows[row.$$index - 1].amount,
      'u-textRight': true
    };
  }

  renderEmptyOnTotalRow(row, value) {
    if (row.isTotal()) {
      return '';
    }
    return value;
  }

  bindOnSuccess(pagedData) {
    this.page = pagedData.page;
    this.rows = pagedData.data;
  }

  getCheckTitle(row) {
    if (row.checked && row.checkedByUserName) {
      return `${row.checkedDate} - ${row.checkedByUserName}`;
    }
    return '';
  }

  setVerified(row, verified): void {
    let contentMessage;

    if (verified) {
      contentMessage = this.translate.instant('are you sure you want to mark the cash register as checked');
    } else {
      contentMessage = this.translate.instant('are you sure you want to remove the checked mark');
    }

    this.confirmService.confirm({ contentMessage }).subscribe(result => {
      if (result && result.doAction) {
        this.verifyCashRegister(verified, row);
      }
    });
  }

  verifyCashRegister(verified: boolean, row): void {
    this.pageLoaderService.setPageLoadingStatus(true);

    const cashRegister = new CashRegisterModel();
    cashRegister.cashRegisterId = row.voucherNumber;
    cashRegister.verified = verified;

    this.cashRegisterService
      .verifyCashRegister(cashRegister)
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe(
        () => {
          row.verified = verified;
          this.loadPage();
          this.notificationBar.success('cash register check updated with success');
        },
        (err: string) => {
          if (err === 'ErrCashRegisterVendorNotFound') {
            this.auth.logout();
          } else {
            this.notificationBar.error(err);
          }
        }
      );
  }
  openDescription(row): void {
    const config = new MdDialogConfig();

    const dialogRef = this.dialogRef.open(CashRegisterDescriptionModalComponent, config);
    dialogRef.componentInstance.cashRegisterId = row.voucherNumber;
    dialogRef.componentInstance.loadCashRegiter();
    dialogRef.componentInstance.onSaveSuccess = () => this.loadPage();
  }

  handleActivate(activateInfo): void {
    if (activateInfo.type === 'dblclick' && activateInfo.row && (activateInfo.row.isOpening() || activateInfo.row.isClosing())) {
      this.openDescription(activateInfo.row);
    }
  }
}
