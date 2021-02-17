import { Component, OnInit, Input, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as moment from 'moment';

import { CartSelectorService } from './cart-selector.service';
import { Page } from '../models/page.model';
import { CartSelectorModel } from './cart-selector.model';

import { TranslateService } from '../../core/translate/translate.service';
import { CartSelectorColumns } from './cart-selector-columns';
import { Router } from '@angular/router';
import { NotificationBarService } from '../notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  selector: 'cart-selector-grid',
  templateUrl: 'cart-selector-grid.component.html'
})

export class CartSelectorGridComponent implements OnInit {
  @Input() multipleSelection: boolean;
  @Input() filter: any;
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @Output() onSelectionChange = new EventEmitter<Array<CartSelectorModel>>();

  page = new Page();
  loading: boolean = false;
  rows = new Array<CartSelectorModel>();
  columns: any = [];
  defaultSortType = 'date';
  defaultSortDirection = 'desc';
  selectedCarts: Array<CartSelectorModel> = [];
  getRowClassBound: Function;

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  dateFrom = new FormControl();
  dateTo = new FormControl();
  cartNumber = new FormControl();
  name = new FormControl();
  lastname = new FormControl();
  user = new FormControl();
  province = new FormControl();

  constructor(
              private cartSelectorService: CartSelectorService,
              private notificationBar: NotificationBarService,
              private router: Router,
              private translate: TranslateService,
              private cartSelectorColumns: CartSelectorColumns) {
    this.page.pageNumber = 0;
    this.page.size = 5;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.getRowClassBound = this.getRowClass.bind(this);
  }

  ngOnInit(): void {
    this.clearSearchForm();

    this.columns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 50,
        sortable: false
      },
      this.cartSelectorColumns.cartNumberColumn(),
      this.cartSelectorColumns.dateColumn(),
      this.cartSelectorColumns.nameColumn(),
      this.cartSelectorColumns.lastnameColumn(),
      this.cartSelectorColumns.userColumn(),
      this.cartSelectorColumns.provinceColumn(),
    ];

    this.onSearch();
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
    this.dateFrom.setValue(this.page.filters.from);
    this.dateFrom.markAsPristine();
    this.dateTo.setValue(this.page.filters.to);
    this.dateTo.markAsPristine();
    this.cartNumber.setValue('');
    this.cartNumber.markAsPristine();
    this.name.setValue('');
    this.name.markAsPristine();
    this.lastname.setValue('');
    this.lastname.markAsPristine();

    if (this.filter.clientId) {
      this.user.setValue(this.filter.clientId);
      this.user.disable();
    } else {
      this.user.setValue('');
    }
    this.user.markAsPristine();

    this.province.setValue('');
    this.province.markAsPristine();
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
    this.cartSelectorService
      .getCarts(this.page)
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
    this.page.filters.from = this.dateFrom.value;
    this.page.filters.to = this.dateTo.value;
    this.page.filters.cartNumber = this.cartNumber.value;
    this.page.filters.name = this.name.value;
    this.page.filters.lastname = this.lastname.value;
    this.page.filters.user = this.user.value;
    this.page.filters.province = this.province.value;

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
  }

  toggleSelected(cart: CartSelectorModel): void {
    if (this.isSelected(cart)) {
      this.selectedCarts = this.selectedCarts.filter(selCart => selCart.cartNumber !== cart.cartNumber);
    } else {
      if (this.multipleSelection) {
        this.selectedCarts.push(cart);
      } else {
        this.selectedCarts = [cart];
      }
    }
    this.onSelectionChange.emit(this.selectedCarts.slice());
  }

  isSelected(cart: CartSelectorModel): boolean {
    return this.selectedCarts.some((selCart) => cart.cartNumber === selCart.cartNumber);
  }

  getRowClass(cart: CartSelectorModel) {
    return {
      'selected-row': this.isSelected(cart)
    };
  }

  resetSelected(): void {
    this.selectedCarts = [];
    this.onSelectionChange.emit(this.selectedCarts.slice());
  }
}
