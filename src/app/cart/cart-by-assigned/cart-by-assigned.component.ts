import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CartService } from '../service/cart.service';
import { Page } from '../../shared/models/page.model';

import { TranslateService } from '../../core/translate/translate.service';
import { CartColumns } from '../shared/cart-columns';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import { CartHistoryModalComponent } from '..';
import { IComboItem } from '../../shared/IComboItem';
import { CartByAssignedItem } from '../model/cart-by-assigned.model';
import { CartDetailModel } from '../model/cart-detail.model';

const CONTROL_STATE = 3;
const STATE_MAP = [];
const PAGE_KEY = 'cartByAssigned';

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
  templateUrl: 'cart-by-assigned.component.html',
  styleUrls: ['./cart-by-assigned.component.scss'],
})
export class AssignedComponent implements OnInit {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @ViewChild('workingCellTemplate') workingCellTemplate: TemplateRef<any>;
  @ViewChild('paymentCellTemplate') paymentCellTemplate: TemplateRef<any>;
  @ViewChild('attachedCellTemplate') attachedCellTemplate: TemplateRef<any>;
  @ViewChild('sanctionedUserStateCellTemplate') sanctionedUserStateCellTemplate: TemplateRef<any>;
  @ViewChild('stateNameCellTemplate') stateNameCellTemplate: TemplateRef<any>;
  page = new Page();
  loading: boolean = false;
  rows = new Array<CartByAssignedItem>();
  fixedColumns: any = [];
  columns: any = [];
  readonly ASSIGNED_FILTERS_COMBO:IComboItem<string>[] = [
    {value: 'CarritoId', viewValue: 'Nro. Pedido'},
    {value: 'FechaEmision', viewValue: 'Fecha Creación'},
    {value: 'FechaEstado', viewValue: 'Fecha Estado'},
    {value: 'Total', viewValue: 'Importe'}
  ]
  defaultSortType = this.ASSIGNED_FILTERS_COMBO[0].value ;
  defaultSortDirection = this.page.SortDirection.Ascending
  selectedRows: Array<CartByAssignedItem> = [];
  getRowClassBound: Function;
  getStateNameClassBound: Function;
  isClaimPaymentVisible: boolean = false;
  isTrackNumberVisible: boolean = false;

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  filterId = new FormControl();
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
            ) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.page.filters.filter = '';
    this.page.filters.noTrackNumber = false;
    this.getRowClassBound = this.getRowClass.bind(this);
  }

  ngOnInit(): void {
    const prevPageState = this.cartService.getPagePrevState(PAGE_KEY);
    this.initSearchForm(prevPageState || this.page);
    this.onComboFilterSelected();

    this.fixedColumns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 39,
        cellClass: 'Cell--selectedMark',
        sortable: false
      },
      this.cartColumns.cartNumberColumn(),
      this.cartColumns.registerDateColumn(),
      this.cartColumns.stateDateColumn(),
      {
        name: 'Estado',
        prop: 'stateName',
        cellTemplate: this.stateNameCellTemplate,
        width: 90,
        sortable: false,
        cellClass: 'u-textCenter Cell--noSidePadding',
        headerClass: 'u-textCenter'
      },
      this.cartColumns.totalAmountColumn(),
      this.cartColumns.locationColumn(),
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
        name: this.translate.instant('user') +' ' 
        + this.translate.instant('penalize|short'),
        cellTemplate: this.sanctionedUserStateCellTemplate,
        width: 90,
        sortable: false,
        cellClass: 'u-textCenter Cell--noSidePadding',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('working'),
        cellTemplate: this.workingCellTemplate,
        width: 122,
        sortable: false,
        cellClass: 'u-textCenter Cell--noSidePadding',
        headerClass: 'u-textCenter'
      }
    ];
  this.columns = [...this.fixedColumns/*,this.assigneeColumn*/];
  }

  initSearchForm(page: Page): void {
    this.page.pageNumber = page.pageNumber;
    this.page.size = page.size;
    this.page.filters.sortType = page.filters.sortType;
    this.page.filters.sortDirection = page.filters.sortDirection;

    // Set Form Controls
    this.filterId.setValue(this.ASSIGNED_FILTERS_COMBO[0].value);
    this.filterId.markAsPristine();
    this.noTrackNumber.setValue(page.filters.noTrackNumber);
    this.noTrackNumber.markAsPristine();
    this.filter.setValue(page.filters.filter);
    this.filter.markAsPristine();
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
      .getCartReportByAssigned(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          pagedData => this.bindOnSuccess(pagedData),
          err => this.notificationBar.error(err)
        );
    this.cartService.setPagePrevState(PAGE_KEY, this.page);
  }

  onComboFilterSelected(): void {
    this.page.filters.sortType = this.filterId.value;
    this.resetSelected();
    this.loadPage();
  }

  onSearch(): void {
    this.loading = true;
    this.page.pageNumber = 0;
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

  toggleSelected(cart: CartByAssignedItem): void {
    if (this.isSelected(cart)) {
      this.selectedRows = this.selectedRows.filter(selected => selected.cartNumber !== cart.cartNumber);
    } else {
      this.selectedRows = [ cart ];
    }
  }

  isSelected(cart: CartByAssignedItem): boolean {
    return this.selectedRows.some((selected) => cart.cartNumber === selected.cartNumber);
  }

  getRowClass(cart: CartByAssignedItem) {
    return {
      'selected-row': this.isSelected(cart),
      'text-highlighted-row': cart.isCarriedFromPointOfSale
    };
  }

  getStateNameClass(cart:CartByAssignedItem) {
    return {
      'default': cart.stateId<CONTROL_STATE && !cart.isCarriedFromPointOfSale,
      'in-control':cart.stateId ==CONTROL_STATE && !cart.isCarriedFromPointOfSale, 
      'before-control':cart.stateId>CONTROL_STATE && !cart.isCarriedFromPointOfSale
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
    this.router.navigate(['/assigned/detail', cartId]);
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

  onKeypress($event): void {
    if ($event.key === 'Enter') {
      this.onSearch();
      $event.preventDefault();
    }
  }

  onStartPreparation(){
    const actionMessage = this.translate.instant('ok');
    const contentMessage = this.translate.instant('are you sure start preparation on order');

    this.confirmService.confirm({ contentMessage, actionMessage }).subscribe(result => {
      if (result && result.doAction) {
        this.loading = true;   
        this.cartService.startOrderPreparation(Number(this.selectedRows[0].cartNumber))
        .subscribe((res:boolean)=>{
          if(res){
            this.loadPage();
            this.notificationBar.success(this.translate.instant('successful operation'));
          }
          else this.notificationBar.error(this.translate.instant('ErrUnexpected'));
        },
        error => this.notificationBar.error(this.translate.instant('ErrUnexpected')),
        ()=> this.loading = false )
      } 
    });
  }
  
  onReleaseOrder(){
    const actionMessage = this.translate.instant('ok');
    const contentMessage = this.translate.instant('are you sure release order');
    this.confirmService.confirm({ contentMessage, actionMessage }).subscribe(result => {
      if (result && result.doAction) {
        this.loading = true;   
        this.cartService.releaseOrder(Number(this.selectedRows[0].cartNumber))
        .subscribe((res:boolean)=>{
          if(res){
            this.loadPage();
            this.notificationBar.success(this.translate.instant('successful operation'));
          }
          else this.notificationBar.error(this.translate.instant('ErrUnexpected'));
        },
        error => this.notificationBar.error(this.translate.instant('ErrUnexpected')),
        ()=> this.loading = false )
      }  
    });
  }

  onGetOrder(){
    this.loading = true;   
    this.cartService.requestOrder()
    .subscribe((res:CartDetailModel)=>{
      if(res.cartNumber){
        this.loadPage();
        this.notificationBar.success(this.translate.instant('successful operation'));
      }
      else this.notificationBar.success(this.translate.instant('No se encontraron pedidos'));
    },
    error => this.notificationBar.error(this.translate.instant('ErrUnexpected')),
    ()=> this.loading = false )
  }
}
