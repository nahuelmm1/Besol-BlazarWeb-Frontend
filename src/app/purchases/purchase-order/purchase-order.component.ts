import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Page } from '../../shared/models/page.model';
import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PurchaseOrderItem } from '../model/purchase-order-item.model';
import { PurchaseOrderColumns } from '../model/purchase-order-columns';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { CartService } from '../../cart/service/cart.service';
import { CartBrandModel } from '../../cart/model/cart-brand.model';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';
import { Router } from '@angular/router';

const PAGE_KEY = 'purchaseOrder';
const pagePrevStates: any = {};

@Component({
  moduleId: module.id,
  templateUrl: 'purchase-order.component.html'
})
export class PurchaseOrderComponent implements OnInit {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @ViewChild('nroOCCellTemplate') nroOCCellTemplate: TemplateRef<any>;
  @ViewChild('brandCellTemplate') brandCellTemplate: TemplateRef<any>;
  @ViewChild('dateCellTemplate') dateCellTemplate: TemplateRef<any>;
  @ViewChild('storeCellTemplate') storeCellTemplate: TemplateRef<any>;
  @ViewChild('requestedCellTemplate') requestedCellTemplate: TemplateRef<any>;
  @ViewChild('receivedCellTemplate') receivedCellTemplate: TemplateRef<any>;
  @ViewChild('totalAmountCellTemplate') totalAmountCellTemplate: TemplateRef<any>;
  @ViewChild('readCellTemplate') readCellTemplate: TemplateRef<any>;
  @ViewChild('deliveredCellTemplate') deliveredCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<PurchaseOrderItem>();
  columns: any = [];
  defaultSortType = 'nroOC';
  defaultSortDirection = 'desc';
  selectedRows: Array<PurchaseOrderItem> = [];
  getRowClassBound: Function;
  brands: Array<CartBrandModel> = [];
  stores: Array<PointOfSaleModel> = [];
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };
  brandId = new FormControl();
  storeIds = new FormControl();
  pendingDelivery = new FormControl();

  constructor(
              private purchaseOrderService: PurchaseOrderService,
              private notificationBar: NotificationBarService,
              private localStorageService: LocalStorageService,
              private translate: TranslateService,
              private purchaseOrderColumns: PurchaseOrderColumns,
              private pofService: PointOfSaleService,
              private cartService: CartService,
              private router: Router
            ) {
    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.page.filters.brandId = -1;
    this.page.filters.storeIds = [];
    this.page.filters.delivered = undefined;
    this.getRowClassBound = this.getRowClass.bind(this);
  }

  ngOnInit(): void {
    const prevPageState = this.getPagePrevState(PAGE_KEY);
    this.initSearchForm(prevPageState || this.page);
    this.initBrands();
    this.initStores();
    this.columns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 20,
        cellClass: 'u-textCenter',
        sortable: false
      },
      this.purchaseOrderColumns.nroOCColumn({cellTemplate: this.nroOCCellTemplate}),
      this.purchaseOrderColumns.brandColumn({cellTemplate: this.brandCellTemplate}),
      this.purchaseOrderColumns.dateColumn({cellTemplate: this.dateCellTemplate}),
      this.purchaseOrderColumns.storeColumn({cellTemplate: this.storeCellTemplate}),
      this.purchaseOrderColumns.requestedProductsColumn({cellTemplate: this.requestedCellTemplate}),
      this.purchaseOrderColumns.receivedProductsColumn({cellTemplate: this.receivedCellTemplate}),
      this.purchaseOrderColumns.totalAmountColumn({cellTemplate: this.totalAmountCellTemplate}),
      this.purchaseOrderColumns.readColumn({cellTemplate: this.readCellTemplate}),
      this.purchaseOrderColumns.deliveredColumn({cellTemplate: this.deliveredCellTemplate})
    ];
  }

  initSearchForm(page: Page): void {
    this.page.pageNumber = page.pageNumber;
    this.page.size = page.size;
    this.page.filters.sortType = page.filters.sortType;
    this.page.filters.sortDirection = page.filters.sortDirection;
    this.brandId.setValue(-1);
    this.brandId.markAsPristine();
    this.storeIds.setValue([]);
    this.storeIds.markAsPristine();
    this.pendingDelivery.setValue(page.filters.pendingDelivery);
    this.pendingDelivery.markAsPristine();
  }

  initBrands(): void {
    this.loading = true;
    this.cartService.getBrands()
      .subscribe((brands: Array<CartBrandModel>) => {
          this.brands = brands;
          this.brandId.setValue(-1);
        },
        (err) => {
          this.notificationBar.error(err);
        }
      );
  }

  initStores(): void {
    this.loading = true;
    this.pofService.getPointsOfSale()
      .subscribe((stores: Array<PointOfSaleModel>) => {
        this.stores = stores;
        // all selected as default
        let storesArray = [];
        stores.forEach(st => {
          storesArray.push(st.pointOfSaleId);
        });
        this.storeIds.setValue(storesArray);
        this.storeIds.markAsPristine();
        this.page.filters.storeIds = storesArray.join(',');
        this.loadPage();
      },
      (err) => {
        this.notificationBar.error(err);
      });
  }

  onBrandSelected(): void {
    this.loading = true;
    this.page.filters.brandId = this.brandId.value;
    this.brandId.markAsPristine();
    this.resetSelected();
    this.loadPage();
  }

  onStoreSelected(): void {
    if (this.storeIds.value.length > 0) {
      const storesSelected = this.storeIds.value.join(',');
      this.loading = true;
      this.page.filters.storeIds = storesSelected;
      this.storeIds.markAsPristine();
      this.resetSelected();
      this.loadPage();
    } else {
      this.resetSelected();
      this.rows = [];
      // this.page = 0;
    }
  }

  onPendingDeliveryChange(): void {
    this.loading = true;
    this.page.filters.pendingDelivery = this.pendingDelivery.value;
    this.resetSelected();
    this.loadPage();
  }

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
    if (this.storeIds.value.length === 0) {
      this.notificationBar.error('Debe seleccionar al menos un Local');
      this.loading = false;
    } else {
      this.loading = true;
      this.purchaseOrderService.getPurchaseOrders(this.page)
          .finally(() => {
            this.loading = false;
           })
          .subscribe(
            pagedData => {
              this.bindOnSuccess(pagedData);
            },
            err => {
              this.notificationBar.error(err);
            }
           );
      this.setPagePrevState(PAGE_KEY, this.page);
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
  }

  toggleSelected(purchaseOrder: PurchaseOrderItem): void {
    if (this.isSelected(purchaseOrder)) {
      this.selectedRows = this.selectedRows.filter(selected => selected.nroOC !== purchaseOrder.nroOC);
    } else {
      this.selectedRows = [ purchaseOrder ];
    }
  }
  
  isSelected(purchaseOrder: PurchaseOrderItem): boolean {
    return this.selectedRows.some((selected) => purchaseOrder.nroOC === selected.nroOC);
  }

  getRowClass(purchaseOrder: PurchaseOrderItem) {
    return {
      'selected-row': this.isSelected(purchaseOrder),
      'text-highlighted-row': this.isSelected(purchaseOrder)
    };
  }

  resetSelected(): void {
    this.selectedRows = [];
  }

  hasSelection(): boolean {
    return this.selectedRows.length > 0;
  }
  
  setPagePrevState(key: string, page: Page): void {
    pagePrevStates[key] = page;
  }

  getPagePrevState(key: string): Page {
    return pagePrevStates[key];
  }

  onCreate() {
    this.router.navigate(['/purchases/purchaseOrder/create'],
                         { queryParams: { brandId: this.brandId.value, storeIds: this.storeIds.value.join(',') }});
  }

}
