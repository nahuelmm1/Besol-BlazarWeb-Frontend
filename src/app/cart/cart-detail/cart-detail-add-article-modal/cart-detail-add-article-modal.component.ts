import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartService } from '../../service/cart.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { FormControl } from '@angular/forms';
import { Page } from '../../../shared/models/page.model';
import { CartDetailArticleModel } from '../../model/cart-detail-article.model';
import { CartDetailProductModel } from '../../model/cart-detail-product.model';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-add-article-modal.component.html'
})
export class CartDetailAddArticleModalComponent implements OnInit {
  @Input() cartNumber;
  brandId = new FormControl();
  filter = new FormControl();
  brands: any[];
  page = new Page();
  loading: boolean = false;
  rows = new Array<CartDetailArticleModel>();
  columns: any = [];
  activeRow: any = null;
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };
  size = new FormControl();
  color = new FormControl();
  quantity = new FormControl();
  option = new FormControl();
  @ViewChild('articleGrid') articleGrid: any;
  @ViewChild('offertCellTemplate') offertCellTemplate: TemplateRef<any>;
  @ViewChild('expandCellTemplate') expandCellTemplate: TemplateRef<any>;

  constructor(private dialogRef: MdDialogRef<CartDetailAddArticleModalComponent>,
              private cartService: CartService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) {
                this.page.pageNumber = 0;
                this.page.size = 5;
              }

  ngOnInit(): void {
    this.cartService.getBrands().subscribe(
      (brands) => {
        this.brands = brands;
        const selected = brands[0] || { brandId: ''};
        this.brandId.setValue(selected.brandId);
        this.brandId.markAsPristine();
        this.onSearch();
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );

    this.brandId.setValue('');
    this.brandId.markAsPristine();
    this.filter.setValue('');
    this.filter.markAsPristine();
    this.size.setValue('');
    this.size.markAsPristine();
    this.color.setValue('');
    this.color.markAsPristine();
    this.quantity.setValue('');
    this.quantity.markAsPristine();
    this.option.setValue('');
    this.option.markAsPristine();

    this.columns = [
      {
        name: this.translate.instant('article'),
        prop: 'name',
        width: 135,
        sortable: false,
      },
      {
        name: this.translate.instant('description'),
        prop: 'description',
        width: 325,
        sortable: false,
      },
      {
        name: this.translate.instant('unit price'),
        prop: 'unitPrice',
        width: 145,
        sortable: false,
        cellClass: 'u-textRight',
        headerClass: 'u-textRight'
      },
      {
        name: this.translate.instant('offert'),
        prop: 'offert',
        width: 135,
        sortable: false,
        cellTemplate: this.offertCellTemplate,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        width: 165,
        sortable: false,
        cellTemplate: this.expandCellTemplate,
        cellClass: 'u-textCenter Cell--button Cell--button-article',
        headerClass: 'u-textCenter'
      },

    ];

  }

  onBrandChange(brand) {
    this.onSearch();
  }

  onKeypress($event): void {
    if ($event.key === 'Enter') {
      this.onSearch();
      $event.preventDefault();
    }
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
    this.cartService
      .getArticles(this.page)
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

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onSearch(): void {
    this.loading = true;
    this.page.pageNumber = 0;
    this.page.filters.cartNumber = this.cartNumber;
    this.page.filters.brandId = this.brandId.value;
    this.page.filters.filter = this.filter.value;

    this.loadPage();
  }

  toggleExpandRow(row) {
    if (this.activeRow && row !== this.activeRow && this.activeRow.$$expanded) {
      this.articleGrid.rowDetail.toggleExpandRow(this.activeRow);
    }
    this.articleGrid.rowDetail.toggleExpandRow(row);
    this.activeRow = row;
  }

  onDetailToggle(event) {
    const row = event.value;
    if (!row.$$expanded) {
      row.isLoading = true;
      this.cartService.getArticleDetails(row.productDefinitionId)
      .finally(() => row.isLoading = false)
      .subscribe(
        (details) => {
          row.details = details;
          this.size.setValue((details.sizes[0] || {}).sizeId);
          this.size.markAsPristine();
          this.color.setValue((details.colors[0] || {}).colorId);
          this.color.markAsPristine();
          this.quantity.setValue(1);
          this.quantity.markAsPristine();
          this.option.setValue('');
          this.option.markAsPristine();
        }
      );
    }
  }

  addArticle(row) {
    const article = new CartDetailProductModel();
    article.cartNumber = this.cartNumber;
    article.productDefinitionId = row.productDefinitionId;
    article.sizeId = this.size.value;
    article.colorId = this.color.value;
    article.quantity = this.quantity.value;
    article.optionComment = this.option.value;

    this.cartService.addArticle(article).subscribe(
      (cartUpdated) => {
        this.dialogRef.close({
          doAction: true,
          cart: cartUpdated
        });
        this.notificationBar.success('cart express updated with success');
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );
  }
}
