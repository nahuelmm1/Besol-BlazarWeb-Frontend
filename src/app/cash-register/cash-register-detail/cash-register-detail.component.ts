import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Page } from '../../shared/models/page.model';
import { CashRegisterListItem } from '../model/cash-register-list.model';
import { CashRegisterService } from '../service/cash-register.service';

import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';

import { TranslateService } from '../../core/translate/translate.service';
import { LoggingService } from '../../core/logging/logging.service';

import { CashRegisterColumns } from '../shared/cash-register-columns';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  moduleId: module.id,
  templateUrl: 'cash-register-detail.component.html',
  styles: [`
    .log-list-container {
      margin: 36px;
    }
  `]
})

export class CashRegisterDetailComponent implements OnInit {
  machinePos: PointOfSaleModel = null;
  page = new Page();
  loading: boolean = false;
  loadingPointOfSale: boolean = true;
  rows = new Array<CashRegisterListItem>();
  columns: any = [];

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
    // Footer total message
    totalMessage: this.translate.instant('total')
  };

  constructor(private cashRegisterService: CashRegisterService,
              private pointOfSaleService: PointOfSaleService,
              private route: ActivatedRoute,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private cashRegisterColumns: CashRegisterColumns,
              private localStorageService: LocalStorageService,
              private logService: LoggingService) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
  }

  ngOnInit() {
    this.columns = [
      this.cashRegisterColumns.dateColumn(),
      this.cashRegisterColumns.operationColumn(),
      this.cashRegisterColumns.voucherNumberColumn(),
      this.cashRegisterColumns.userNameColumn(),
      this.cashRegisterColumns.amountColumn(),
      this.cashRegisterColumns.amountInlandColumn(),
      this.cashRegisterColumns.amountExpressColumn(),
    ];
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.loadingPointOfSale = true;
    this.page.pageNumber = 0;

    this.pointOfSaleService.getPointOfSale()
        .finally(() => this.loading = false)
        .switchMap((pos: PointOfSaleModel) => {
          this.machinePos = pos;
          this.loadingPointOfSale = false;
          if (pos && !pos.hasCashRegister) {
            return Observable.throw('ErrPointOfSaleHasNoCashRegister');
          }
          this.page.filters.pointOfSaleId = pos.pointOfSaleId;
          return this.cashRegisterService.getCashRegisterDetail(this.page);
        })
        .subscribe(
          (pagedData) => {
            this.page = pagedData.page;
            this.rows = pagedData.data;
          },
          (err) => {
            let errType = 'snackError';
            let duration = 3500;
            if (err === 'ErrCashRegisterPointOfSaleNotFound') {
              errType = 'snackWarning';
              duration = 10000;
            }

            this.notificationBar.notify(err, [errType], duration);
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
    // this.page.filters.cashRegisterId = this.cashRegisterId;

    this.cashRegisterService
      .getCashRegisterDetail(this.page)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        (pagedData) => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        },
        (err) => this.notificationBar.error(err)
      );
  }

  getRowClass(row): any {
    return {
      'open-close-row': row.isOpening() || row.isClosing()
    };
  }

  getPointOfSaleDescription(): string {
    if (this.machinePos === null) {
      return this.translate.instant('ErrPointOfSaleNotFound');
    }

    if (this.isValidMachinePos()) {
      return this.machinePos.name;
    } else {
      return this.translate.instant('ErrPointOfSaleHasNoCashRegister');
    }
  }

  private isValidMachinePos(): boolean {
    return this.machinePos !== null && this.machinePos.hasCashRegister;
  }
}
