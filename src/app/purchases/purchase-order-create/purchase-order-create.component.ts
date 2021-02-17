import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Page } from '../../shared/models/page.model';
import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../../shared/point-of-sale.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PurchaseOrderCreateColumns } from '../model/purchase-order-create-columns';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { CartService } from '../../cart/service/cart.service';
import { CartBrandModel } from '../../cart/model/cart-brand.model';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { FinishOrderDialogComponent } from './finish-order-dialog.component';
import { ProductsPurchaseOrderItem } from '../model/products-purchase-order-item.model';
import { ActivatedRoute } from '@angular/router';
import { IMyDrpOptions, IMyDateRangeModel } from 'mydaterangepicker';

@Component({
  moduleId: module.id,
  templateUrl: 'purchase-order-create.component.html'
})
export class PurchaseOrderCreateComponent implements OnInit {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @ViewChild('articleCellTemplate') articleCellTemplate: TemplateRef<any>;
  @ViewChild('colourCellTemplate') colourCellTemplate: TemplateRef<any>;
  @ViewChild('sizeCellTemplate') sizeCellTemplate: TemplateRef<any>;
  @ViewChild('storeCellTemplate') storeCellTemplate: TemplateRef<any>;
  @ViewChild('minStockCellTemplate') minStockCellTemplate: TemplateRef<any>;
  @ViewChild('stockCellTemplate') stockCellTemplate: TemplateRef<any>;
  @ViewChild('soldCellTemplate') soldCellTemplate: TemplateRef<any>;
  @ViewChild('unitPriceTemplate') unitPriceCellTemplate: TemplateRef<any>;
  @ViewChild('quantityCellTemplate') quantityCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<ProductsPurchaseOrderItem>();
  columns: any = [];
  defaultSortType = 'article';
  defaultSortDirection = 'desc';
  selectedRows: Array<ProductsPurchaseOrderItem> = [];
  getRowClassBound: Function;
  brands: Array<CartBrandModel> = [];
  stores: Array<PointOfSaleModel> = [];
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };
  brandId = new FormControl();
  storeIds = new FormControl();
  dateFrom: Date;
  dateUntil: Date;
  myDateRange = new FormControl();
  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd.mm.yyyy',
    minYear: 1990,
    inline: false,
    height: '25px',
    width: '250px',
    indicateInvalidDateRange: true
  };
  totalOrder = 0.00;
  storesTotals = [];
  loadingBrands: boolean = false;
  loadingStores: boolean = false;
  pendingReload = false;
  autoSelected = false;
  salesUpperTo = new FormControl();
  quantityAction: any = undefined;

  constructor(
              private purchaseOrderService: PurchaseOrderService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private purchaseOrderCreateColumns: PurchaseOrderCreateColumns,
              private pofService: PointOfSaleService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private dialogRef: MdDialog
            ) {
  }
 
  ngOnInit(): void {
    // brand from query param
    this.page.filters.brandId = undefined;
    const brandParam = Number(this.route.snapshot.queryParams['brandId']);
    if (brandParam > 0) {
      this.page.filters.brandId = brandParam;
    }
    this.initBrands();
 
    // stores from query param
    this.page.filters.storeIds = undefined;
    let storesArray = [];
    const storesParam = this.route.snapshot.queryParams['storeIds'];
    if (storesParam !== undefined && storesParam.length > 0) {
      const storesFromParameters = storesParam.split(',');
      storesFromParameters.forEach(param => storesArray.push(Number(param)));
    }
    this.page.filters.storeIds = storesArray.join(',');
    this.initStores();

    this.columns = [
      {
        name: '',
        cellTemplate: this.selectedCellTemplate,
        width: 15,
        cellClass: 'u-textCenter',
        sortable: false
      },
      this.purchaseOrderCreateColumns.articleColumn({cellTemplate: this.articleCellTemplate}),
      this.purchaseOrderCreateColumns.colourColumn({cellTemplate: this.colourCellTemplate}),
      this.purchaseOrderCreateColumns.sizeColumn({cellTemplate: this.sizeCellTemplate}),
      this.purchaseOrderCreateColumns.storeColumn({cellTemplate: this.storeCellTemplate}),
      this.purchaseOrderCreateColumns.minStockColumn({cellTemplate: this.minStockCellTemplate}),
      this.purchaseOrderCreateColumns.stockColumn({cellTemplate: this.stockCellTemplate}),
      this.purchaseOrderCreateColumns.soldColumn({cellTemplate: this.soldCellTemplate}),
      this.purchaseOrderCreateColumns.unitPriceColumn({cellTemplate: this.unitPriceCellTemplate}),
      this.purchaseOrderCreateColumns.quantityColumn({cellTemplate: this.quantityCellTemplate}),
    ];

    this.page.pageNumber = 0;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.page.filters.dateFrom = undefined;
    this.page.filters.dateUntil = undefined;
    this.getRowClassBound = this.getRowClass.bind(this);

    this.dateUntil  = new Date();
    this.dateFrom  = new Date();
    this.dateFrom.setDate(this.dateUntil.getDate() - 30);
    this.myDateRange.setValue({
        beginDate: {
            year: this.dateFrom.getFullYear(),
            month: this.dateFrom.getMonth() + 1,
            day: this.dateFrom.getDate()
        },
        endDate: {
            year:  this.dateUntil.getFullYear(),
            month: this.dateUntil.getMonth() + 1,
            day: this.dateUntil.getDate()
        }
    });
    this.page.filters.dateFrom = this.dateFrom.getFullYear() + '/' + (this.dateFrom.getMonth()+1) + '/' + this.dateFrom.getDate();
    this.page.filters.dateUntil = this.dateUntil.getFullYear() + '/' + (this.dateUntil.getMonth()+1) + '/' + this.dateUntil.getDate();

    if (this.page.filters.brandId !== undefined && this.page.filters.brandId.toString().length > 0 &&
        this.page.filters.storeIds !== undefined && this.page.filters.storeIds.toString().length > 0) {
      this.pendingReload = true;
    }

    this.salesUpperTo.setValue(80); // default


  }

  initBrands(): void {
    this.loadingBrands = true;
    this.cartService.getBrands()
      .finally(() => this.loadingBrands = false)
      .subscribe((brands: Array<CartBrandModel>) => {
          this.brands = brands;
          this.brandId.setValue(this.page.filters.brandId);
      }, (err) => {
          this.notificationBar.error(err);
        }
      );
  }

  initStores(): void {
    this.loadingStores = true;
    this.pofService.getPointsOfSale()
      .finally(() => this.loadingStores = false)
      .subscribe((stores: Array<PointOfSaleModel>) => {
        this.stores = stores;
        let storesArray = [];
        if (this.page.filters.storeIds != undefined) {
          const selectedStores = this.page.filters.storeIds.split(',');
          selectedStores.forEach(param => storesArray.push(Number(param)));
        }
        this.storeIds.setValue(storesArray);
      }, (err) => {
        this.notificationBar.error(err);
      });
  }

  onBrandSelected(): void {
    this.page.filters.brandId = this.brandId.value;
    this.pendingReload = true;
    if (this.rows.length > 0) this.clean();
  }

  onStoreSelected(): void {
    const storesSelected = this.storeIds.value.join(',');
    this.page.filters.storeIds = storesSelected;
    this.pendingReload = true;
    if (this.rows.length > 0) this.clean();
  }

  onDateRangeChanged(event: IMyDateRangeModel) {
    if (event.beginEpoc === 0) return; // clear
    this.dateFrom = new Date(event.beginDate.year, event.beginDate.month -1, event.beginDate.day);
    this.dateUntil = new Date(event.endDate.year, event.endDate.month -1, event.endDate.day);
    this.page.filters.dateFrom = this.dateFrom.getFullYear() + '/' + (this.dateFrom.getMonth()+1) + '/' + this.dateFrom.getDate();
    this.page.filters.dateUntil = this.dateUntil.getFullYear() + '/' + (this.dateUntil.getMonth()+1) + '/' + this.dateUntil.getDate();
    this.pendingReload = true;
    if (this.rows.length > 0) this.clean();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
  }

  onSort(sortInfo) {
    this.page.filters.sortType = sortInfo.column.prop;
    this.page.filters.sortDirection = sortInfo.newValue;
  }

  resetTotals() {
    this.storesTotals = [];
    this.totalOrder = 0.00;
  }

  handleActivate(activateInfo): void {
    if (!activateInfo.row) return;
    if (activateInfo.column.name === 'Cantidad') {
      if (this.quantityAction !== undefined) {
        const dif = 'incr' === this.quantityAction ? 1 : 'decr' === this.quantityAction ? -1 : 0;
        if (dif !== 0) {
          activateInfo.row.quantity += dif;
          this.updateStoreTotal(activateInfo.row.storeId,
            activateInfo.row.store,
            activateInfo.row.unitPrice * dif,
            false);
          if (!this.isSelected(activateInfo.row)) {
            this.selectedRows.push(activateInfo.row);
          }
        }
        this.quantityAction = undefined;
      }
    } else if (activateInfo.type === 'click') {
      this.toggleSelected(activateInfo.row);
    } 
  }

  toggleSelected(productsPurchaseOrderItem: ProductsPurchaseOrderItem): void {
    if (this.isSelected(productsPurchaseOrderItem)) {

      this.updateStoreTotal(productsPurchaseOrderItem.storeId,
        productsPurchaseOrderItem.store,
        productsPurchaseOrderItem.unitPrice * -productsPurchaseOrderItem.quantity,
        false);

      productsPurchaseOrderItem.quantity = 0;

      this.selectedRows = this.selectedRows.filter(selected => 
        productsPurchaseOrderItem.article !== selected.article ||
        productsPurchaseOrderItem.colourId !== selected.colourId ||
        productsPurchaseOrderItem.sizeId !== selected.sizeId ||
        productsPurchaseOrderItem.storeId !== selected.storeId
      );
    } else {
      productsPurchaseOrderItem.quantity = productsPurchaseOrderItem.minStock > productsPurchaseOrderItem.stock ?
                                            productsPurchaseOrderItem.minStock - productsPurchaseOrderItem.sold : 0;
      if (productsPurchaseOrderItem.quantity > 0) {
        this.updateStoreTotal(productsPurchaseOrderItem.storeId,
          productsPurchaseOrderItem.store,
          productsPurchaseOrderItem.unitPrice * productsPurchaseOrderItem.quantity,
          false);
      }
      this.selectedRows.push(productsPurchaseOrderItem);
    }
  }
  
  isSelected(productsPurchaseOrderItem: ProductsPurchaseOrderItem): boolean {
    return this.selectedRows.some((selected) => 
      productsPurchaseOrderItem.code === selected.code &&
      productsPurchaseOrderItem.article === selected.article &&
      productsPurchaseOrderItem.colourId === selected.colourId &&
      productsPurchaseOrderItem.sizeId === selected.sizeId &&
      productsPurchaseOrderItem.storeId === selected.storeId
    );
  }

  getRowClass(productsPurchaseOrderItem: ProductsPurchaseOrderItem) {
    const selected = this.isSelected(productsPurchaseOrderItem);
    return {
      'selected-row': selected,
      'text-highlighted-row': selected
    };
  }

  clean(): void {
    this.selectedRows = [];
    this.rows = [];
    this.resetTotals();
    this.autoSelected = false;
  }

  resetSelected(): void {
    this.selectedRows = [];
    this.rows.forEach(row => row.quantity = 0);
    this.resetTotals();
    this.autoSelected = false;
  }

  hasSelection(): boolean {
    return this.selectedRows.length > 0;
  }

  highlightSoldQuantity(event) {
    return event.sold > event.minStock * this.salesUpperTo.value / 100;
  }

  onFinishOrder(): void {
    if (this.selectedRows.length === 0) {
      this.notificationBar.warning('Debe seleccionar uno o más productos para crear la orden de compra');
    } else {
      this.loading = true;
      this.purchaseOrderService.savePurchaseOrders(this.page.filters.brandId, this.selectedRows)
          .finally(() => {
            this.loading = false;
          })
          .subscribe(res => {
            if (res.ok) {
              this.notificationBar.success(res._body);
              let storesId = this.selectedRows.map(x=>x.storeId).filter(function(value,index,self){
                return self.indexOf(value) === index;});
              this.resetSelected();
              let dialogConfig = new MdDialogConfig();
              dialogConfig.width = '35%';
              dialogConfig.height = '35%';
              dialogConfig.disableClose = true;
              let dialogRef = this.dialogRef.open(FinishOrderDialogComponent, dialogConfig);
              dialogRef.componentInstance.brand = this.brands.find(br => br.brandId === this.page.filters.brandId); 
              dialogRef.componentInstance.storesId = storesId;
            } else {
              this.notificationBar.error(res);
            }
          });
    }
  }

  onSearch() {
    if (!this.pendingReload) {
      this.notificationBar.error('Debe seleccionar una nueva Marca, Local o Rango de fechas para buscar');
    } else if (this.page.filters.brandId === undefined || Number(this.page.filters.brandId) <= 0) {
      this.notificationBar.error('Debe seleccionar una Marca');
    } else if (this.page.filters.storeIds === undefined || this.page.filters.storeIds.toString().length === 0) {
      this.notificationBar.error('Debe seleccionar al menos un Local');
    } else if (this.dateFrom.getFullYear() < 1990) {
      this.notificationBar.error('Debe seleccionar un rango de fechas válido');
    } else {
      this.loading = true;
      this.pendingReload = false
      this.resetSelected();
      this.rows = [];
      this.purchaseOrderService.getProductsForPurchaseOrder(this.page)
          .finally(() => this.loading = false )
          .subscribe(pagedData => {
              this.page = pagedData.page;
              this.rows = pagedData.data;
              this.onAutoSelect();
            }, err => this.notificationBar.error(err)
           );
      }
  }

  updateStoreTotal(storeId: number, storeName: string, quantity: number, reset: boolean) {
    let store = this.storesTotals.find(value => value.storeId === storeId);
    if (store === undefined) {
      if (quantity > 0) {
        this.storesTotals.push({storeId: storeId, storeName: storeName, storeTotal: quantity});
        this.totalOrder += quantity;
      }
    } else {
      if (reset) {
        quantity = quantity > 0 ? quantity : 0.0;
        this.totalOrder = this.totalOrder - store.storeTotal + quantity;
        store.storeTotal = quantity;
      } else {
        let total = store.storeTotal + quantity;
        this.totalOrder = total > 0 ? this.totalOrder + quantity : this.totalOrder - store.storeTotal;
        store.storeTotal = total > 0 ? total : 0.0;
      }
    }
  }

  onAutoSelect() {
    this.loading = true;
    this.resetSelected();
    let storesSubtotals = [];
    this.stores.forEach(store => storesSubtotals.push({id: store.pointOfSaleId, name: store.name, subtotal: 0.0}));
    this.rows.forEach(row => {
      if (row.minStock > row.stock) {
        row.quantity = row.minStock - row.stock;
        this.selectedRows.push(row);
        let storeSubtotal = storesSubtotals.find(store => store.id === row.storeId);
        storeSubtotal.subtotal += row.unitPrice * row.quantity;
      }
    });
    storesSubtotals.forEach(store => {
      this.updateStoreTotal(store.id, store.name, store.subtotal > 0 ? store.subtotal : 0.0, true);
    });
    this.loading = false;
    this.autoSelected = true;
  }

  onChangeQuantity(event) {
    const newQuantity = event.target.value.trim() === '' ? 0 : Number(event.target.value);
    const rowData = event.target.name.split("-");
    let row = this.rows.find(row => row.code.toString() === rowData[0] &&
                                    row.article.toString() === rowData[1] &&
                                    row.colourId.toString() === rowData[2] &&
                                    row.sizeId.toString() === rowData[3] &&
                                    row.storeId.toString() === rowData[4]);
    const dif = newQuantity - row.quantity;
    this.updateStoreTotal(row.storeId,
                          row.store,
                          row.unitPrice * dif,
                          false);
    row.quantity = newQuantity;
    const rowSelected = this.isSelected(row);
    if (newQuantity > 0 && !rowSelected) {
      this.selectedRows.push(row);
    } else if (newQuantity === 0 && rowSelected) {
      this.selectedRows = this.selectedRows.filter(selected => 
        row.article !== selected.article ||
        row.colourId !== selected.colourId ||
        row.sizeId !== selected.sizeId ||
        row.storeId !== selected.storeId
      );
    }
    event.cancelBubble = true;
  }
  
  decrQuantity(event) {
    this.quantityAction = 'decr';
  }

  incrQuantity(event) {
    this.quantityAction = 'incr';
  }

}
