import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

import { CartService } from '../../cart/service/cart.service';
import { Page } from '../../shared/models/page.model';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { CartStateModel } from '../../cart/model/cart-state.model';
import { ReassignCartModalService } from '../../shared/reassign-cart';
import { MdDialog } from '@angular/material';
import { CartByInactiveUsersModel } from '../../cart/model/cart-by-inactive-users.model';
import { InactiveUsersColumns } from './inactive-users-columns';


const PAGE_KEY = 'cartByInactiveUsers';

@Component({
  moduleId: module.id,
  templateUrl: 'inactive-users.component.html'
})
export class InactiveUsersComponent implements OnInit {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @ViewChild('priorityCellTemplate') priorityCellTemplate: TemplateRef<any>;
  @ViewChild('rankingCellTemplate') rankingCellTemplate: TemplateRef<any>;
  @ViewChild('mailCellTemplate') mailCellTemplate: TemplateRef<any>;
  @ViewChild('assigneeCellTemplate') assigneeCellTemplate: TemplateRef<any>;
  @ViewChild('paymentCellTemplate') paymentCellTemplate: TemplateRef<any>;
  @ViewChild('attachedCellTemplate') attachedCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<CartByInactiveUsersModel>();
  fixedColumns: any = [];
  columns: any = [];
  assigneeColumn: any;
  mailColumn: any;
  defaultSortType = 'date';
  defaultSortDirection = 'desc';
  selectedRows: Array<CartByInactiveUsersModel> = [];
  getRowClassBound: Function;
  states: Array<CartStateModel> = [];

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  frmFilter: FormGroup;

  constructor(
              private cartService: CartService,
              private pageLoaderService: PageLoaderService,
              private notificationBar: NotificationBarService,
              private router: Router,
              private dialogRef: MdDialog,
              private route: ActivatedRoute,
              private confirmService: ConfirmDialogueService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService,
              private userSelectorColumns: InactiveUsersColumns,
              private pofService: PointOfSaleService,
              private reassignCartModalService: ReassignCartModalService,
              private fb: FormBuilder,
            ) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.page.filters.filter = '';

    const momentDateLocal = moment().local();
    momentDateLocal.set({hour: 0, minute: 0, second: 0, millisecond: 0});
    this.page.filters.dateTo = momentDateLocal.toDate();
    this.page.filters.dateFrom = momentDateLocal.add(-1, 'w').toDate();
    this.getRowClassBound = this.getRowClass.bind(this);
  }

  ngOnInit(): void {
    const prevPageState = this.cartService.getPagePrevState(PAGE_KEY);
    this.initSearchForm(prevPageState || this.page);

    this.columns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 39,
        cellClass: 'Cell--selectedMark',
        sortable: false
      },
      this.userSelectorColumns.cartNumberColumn(),
      this.userSelectorColumns.dateColumn(),
      this.userSelectorColumns.nameColumn(),
      this.userSelectorColumns.lastnameColumn(),
      this.userSelectorColumns.userColumn(),
      this.userSelectorColumns.provinceColumn(),
    ];
  }

  initSearchForm(page: Page): void {
    this.page.pageNumber = page.pageNumber;
    this.page.size = page.size;
    this.page.filters.sortType = page.filters.sortType;
    this.page.filters.sortDirection = page.filters.sortDirection;
    this.page.filters.filter = page.filters.filter;
    this.page.filters.dateFrom = page.filters.dateFrom;
    this.page.filters.dateTo = page.filters.dateTo;

    this.frmFilter = this.fb.group({
      filter: [this.page.filters.filter],
      dateFrom: [this.page.filters.dateFrom],
      dateTo: [this.page.filters.dateTo],
    });

    this.frmFilter.get('dateFrom').valueChanges.subscribe((dateFrom) => this.onSearch(false, { dateFrom }));
    this.frmFilter.get('dateTo').valueChanges.subscribe((dateTo) => this.onSearch(false, { dateTo }));

    this.loadPage();
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
    this.cartService
      .getCartByInactiveUsers(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          pagedData => this.bindOnSuccess(pagedData),
          err => this.notificationBar.error(err)
        );
    this.cartService.setPagePrevState(PAGE_KEY, this.page);
  }

  onSearch($event, values: any): void {
    this.loading = true;
    this.page.pageNumber = 0;
    this.page.filters = {
      ...this.page.filters,
      ...this.frmFilter.value,
      ...values,
    };

    this.resetSelected();

    this.loadPage();
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  bindOnSuccess(pagedData) {
    this.page = pagedData.page;
    this.rows = pagedData.data;
  }

  handleActivate(activateInfo): void {
    if (activateInfo.type === 'click' && activateInfo.row) {
      this.toggleSelected(activateInfo.row);
    }
    if (activateInfo.type === 'dblclick' && activateInfo.row) {
      if (!this.isSelected(activateInfo.row)) {
        this.selectedRows = [ activateInfo.row ];
      }
      this.onDetail();
    }
  }

  toggleSelected(cart: CartByInactiveUsersModel): void {
    if (this.isSelected(cart)) {
      this.selectedRows = this.selectedRows.filter(selected => selected.cartNumber !== cart.cartNumber);
    } else {
      this.selectedRows = [ cart ];
    }
  }

  isSelected(cart: CartByInactiveUsersModel): boolean {
    return this.selectedRows.some((selected) => cart.cartNumber === selected.cartNumber);
  }

  getRowClass(cart: CartByInactiveUsersModel) {
    return {
      'selected-row': this.isSelected(cart),
    };
  }

  resetSelected(): void {
    this.selectedRows = [];
  }

  hasSelection(): boolean {
    return this.selectedRows.length > 0;
  }

  onDetail() {
    const cartId = this.selectedRows[0].cartNumber;
    this.router.navigate(['/cart/detail-inactive', cartId]);
  }

}
