import { MdDialogRef } from '@angular/material';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CartService } from '../service/cart.service';
import { Page } from '../../shared/models/page.model';
import { CartByStateItem } from '../model/cart-by-state.model';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { CartColumns } from '../shared/cart-columns';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { CartStateModel } from '../model/cart-state.model';
import { ReassignCartModalService } from '../../shared/reassign-cart';
import { MdDialogConfig, MdDialog } from '@angular/material';
import { CartHistoryModalComponent } from '..';
import { CartByStateUserStateDialogueComponent } from './cart-by-state-user-state-dialogue.component';

const DEFAULT_STATE = 2;
const STATE_MAP = [];
const PAGE_KEY = 'cartByState';

// shipped state
STATE_MAP[6] = {
  isTrackNumberVisible: true
};

// prepared state
STATE_MAP[4] = {
  isClaimPaymentVisible: true
};

@Component({
  moduleId: module.id,
  templateUrl: 'cart-by-state.component.html'
})
export class CartByStateComponent implements OnInit {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @ViewChild('priorityCellTemplate') priorityCellTemplate: TemplateRef<any>;
  @ViewChild('userStateCellTemplate') userStateCellTemplate: TemplateRef<any>;
  @ViewChild('rankingCellTemplate') rankingCellTemplate: TemplateRef<any>;
  @ViewChild('mailCellTemplate') mailCellTemplate: TemplateRef<any>;
  @ViewChild('assigneeCellTemplate') assigneeCellTemplate: TemplateRef<any>;
  @ViewChild('paymentCellTemplate') paymentCellTemplate: TemplateRef<any>;
  @ViewChild('attachedCellTemplate') attachedCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<CartByStateItem>();
  fixedColumns: any = [];
  columns: any = [];
  assigneeColumn: any;
  mailColumn: any;
  defaultSortType = 'priority';
  defaultSortDirection = 'asc';
  selectedRows: Array<CartByStateItem> = [];
  getRowClassBound: Function;
  states: Array<CartStateModel> = [];
  isClaimPaymentVisible: boolean = false;
  isTrackNumberVisible: boolean = false;

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  stateId = new FormControl();
  userState = new FormControl();
  noTrackNumber = new FormControl();
  filter = new FormControl();

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
              private cartColumns: CartColumns,
              private pofService: PointOfSaleService,
              private reassignCartModalService: ReassignCartModalService,
            ) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.page.filters.stateId = DEFAULT_STATE;
    this.page.filters.userState = false;
    this.page.filters.filter = '';
    this.page.filters.noTrackNumber = false;
    this.getRowClassBound = this.getRowClass.bind(this);
  }

  ngOnInit(): void {
    const prevPageState = this.cartService.getPagePrevState(PAGE_KEY);
    this.initSearchForm(prevPageState || this.page);
    this.initStates();

    this.fixedColumns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 39,
        cellClass: 'Cell--selectedMark',
        sortable: false
      },
      this.cartColumns.cartNumberColumn(),
      {
        name: this.translate.instant('priority'),
        prop: 'priority',
        cellTemplate: this.priorityCellTemplate,
        width: 110,
        sortable: true,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      this.cartColumns.registerDateColumn(),
      this.cartColumns.stateDateColumn(),
      this.cartColumns.totalAmountColumn(),
      this.cartColumns.locationColumn(),
      {
        name: this.translate.instant('userState|short'),
        prop: 'userState',
        cellTemplate: this.userStateCellTemplate,
        width: 110,
        sortable: true,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      this.cartColumns.usernameColumn(),
      {
        name: this.translate.instant('payment|short'),
        cellTemplate: this.paymentCellTemplate,
        width: 60,
        sortable: false,
        cellClass: 'u-textCenter Cell--noSidePadding',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('attached|short'),
        cellTemplate: this.attachedCellTemplate,
        width: 60,
        sortable: false,
        cellClass: 'u-textCenter Cell--noSidePadding',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('ranking'),
        cellTemplate: this.rankingCellTemplate,
        width: 115,
        sortable: false,
        cellClass: 'u-textCenter Cell--strechSidePadding',
        headerClass: 'u-textCenter Cell--strechSidePadding'
      },
    ];
    this.assigneeColumn = this.cartColumns.assigneeNameColumn({
      cellTemplate: this.assigneeCellTemplate,
      cellClass: 'Cell--assigneeName'
    });
    this.mailColumn = {
      name: this.translate.instant('mail'),
      cellTemplate: this.mailCellTemplate,
      prop: 'paymentClaims',
      width: 115,
      sortable: false,
      cellClass: 'u-textCenter Cell--strechSidePadding Cell--flexCenter',
      headerClass: 'u-textCenter Cell--strechSidePadding'
    };
    this.columns = [...this.fixedColumns, this.assigneeColumn];
  }

  initSearchForm(page: Page): void {
    this.page.pageNumber = page.pageNumber;
    this.page.size = page.size;
    this.page.filters.sortType = page.filters.sortType;
    this.page.filters.sortDirection = page.filters.sortDirection;

    // Set Form Controls
    this.stateId.setValue(page.filters.stateId);
    this.stateId.markAsPristine();
    this.userState.setValue(page.filters.userState);
    this.userState.markAsPristine();
    this.noTrackNumber.setValue(page.filters.noTrackNumber);
    this.noTrackNumber.markAsPristine();
    this.filter.setValue(page.filters.filter);
    this.filter.markAsPristine();
  }

  initStates(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.getStates()
      .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
      .subscribe((states: Array<CartStateModel>) => {
         this.states = states;
         this.onStateSelected();
      },
      (err) => this.notificationBar.error(err));
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
      .getCartReport(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          pagedData => this.bindOnSuccess(pagedData),
          err => this.notificationBar.error(err)
        );
    this.cartService.setPagePrevState(PAGE_KEY, this.page);
  }

  onStateSelected(): void {
    const stateConfig = STATE_MAP[this.stateId.value] || {};
    this.isTrackNumberVisible = stateConfig.isTrackNumberVisible;
    this.isClaimPaymentVisible = stateConfig.isClaimPaymentVisible;
    this.page.filters.stateId = this.stateId.value;

    const lastColumn = stateConfig.isClaimPaymentVisible ? this.mailColumn : this.assigneeColumn;
    this.columns = [...this.fixedColumns, lastColumn];

    this.resetSelected();
    this.loadPage();
  }

  onUserStateChange(): void {
    this.loading = true;
    this.page.filters.userState = this.userState.value;
    this.resetSelected();
    this.loadPage();
  }

  onSearch(): void {
    this.loading = true;
    this.page.pageNumber = 0;
    this.page.filters.stateId = this.stateId.value;
    this.page.filters.userState = this.userState.value;
    if (this.isTrackNumberVisible) {
      this.page.filters.noTrackNumber = this.noTrackNumber.value;
    } else {
      this.page.filters.noTrackNumber = false;
    }
    this.page.filters.filter = this.filter.value;

    this.resetSelected();

    this.loadPage();
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

  toggleSelected(cart: CartByStateItem): void {
    if (this.isSelected(cart)) {
      this.selectedRows = this.selectedRows.filter(selected => selected.cartNumber !== cart.cartNumber);
    } else {
      this.selectedRows = [ cart ];
    }
  }

  isSelected(cart: CartByStateItem): boolean {
    return this.selectedRows.some((selected) => cart.cartNumber === selected.cartNumber);
  }

  getRowClass(cart: CartByStateItem) {
    return {
      'selected-row': this.isSelected(cart),
      'text-highlighted-row': cart.isCarriedFromPointOfSale
    };
  }

  resetSelected(): void {
    this.selectedRows = [];
  }

  hasSelection(): boolean {
    return this.selectedRows.length > 0;
  }

  getPriorityColor(row: CartByStateItem) {
    const maxPriority = 10;
    const step = 256 / maxPriority;
    const priority = Math.min(maxPriority, row.priority);
    const color = Math.floor(255 - priority * step);
    return `rgb(255, ${color}, 0)`;
  }

  onDetail() {
    const cartId = this.selectedRows[0].cartNumber;
    this.router.navigate(['/cart/detail', cartId]);
  }

  onReassign() {
    const isWorking = this.selectedRows[0].isWorking;
    const assignee = this.selectedRows[0].assigneeName;
    const situation = this.translate.instant('in the cart is working the user');
    const question = this.translate.instant('are you sure you want to reassign anyway');

    const confirmOpts = {
      contentMessage: `${situation} <strong>${assignee}</strong>. ${question}`,
      titleMessage: this.translate.instant('cart'),
      actionMessage: this.translate.instant('reassign'),
      cancelMessage: this.translate.instant('no'),
    };
    const cartId = parseInt(this.selectedRows[0].cartNumber, 10);

    if (isWorking) {
      this.confirmService.confirm(confirmOpts).subscribe(result => {
        if (result && result.doAction) {
          this.showReassignModal(cartId);
        }
      });
    } else {
      this.showReassignModal(cartId);
    }
  }

  showReassignModal(cartNumber: number) {
    this.reassignCartModalService.show(cartNumber).subscribe(
      (result) => {
        if (result.doAction) {
          this.loadPage();
        }
      }
    );
  }

  onHistory() {
    const cartId = this.selectedRows[0].cartNumber;
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '80%';

    const dialogRef = this.dialogRef.open(CartHistoryModalComponent, config);
    dialogRef.componentInstance.cartNumber = cartId;
  }

  onClaimPayment() {
    const cartId = this.selectedRows[0].cartNumber;
    this.sendClaimPaymentById(cartId);
  }

  onKeypress($event): void {
    if ($event.key === 'Enter') {
      this.onSearch();
      $event.preventDefault();
    }
  }

  sendClaimPayment(cart: CartByStateItem): void {
    this.sendClaimPaymentById(cart.cartNumber);
  }

  changeUserState(cart: CartByStateItem): void {
    let dialogRef: MdDialogRef<CartByStateUserStateDialogueComponent> = null;
    dialogRef = this.dialogRef.open(CartByStateUserStateDialogueComponent);
    dialogRef.componentInstance.cart = cart;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.loadPage();
        }
    });
  }

  private sendClaimPaymentById(cartId: string): void {
    this.confirmService.confirm({
      titleMessage: this.translate.instant('confirm send claim'),
      contentMessage: this.translate.instant('do you wish to send a payment claim to this client'),
    }).subscribe((result) => {
      if (result.doAction) {
        this.pageLoaderService.setPageLoadingStatus(true);
        this.cartService.claimPayment(cartId)
          .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
          .subscribe(
            () => {
              this.loadPage();
            },
            (err) => this.notificationBar.error(err)
          );
      }
    });
  }
}
