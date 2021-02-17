import { Component, OnInit, Input, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';


import { ClientSelectorService } from './client-selector.service';
import { Page } from '../models/page.model';
import { ClientSelectorModel } from './client-selector.model';

import { TranslateService } from '../../core/translate/translate.service';
import { ClientSelectorColumns } from './client-selector-columns';
import { Router } from '@angular/router';
import { NotificationBarService } from '../notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  selector: 'client-selector-grid',
  templateUrl: 'client-selector-grid.component.html'
})

export class ClientSelectorGridComponent implements OnInit {
  @Input() multipleSelection: boolean;
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @Output() onSelectionChange = new EventEmitter<Array<ClientSelectorModel>>();

  page = new Page();
  loading: boolean = false;
  rows = new Array<ClientSelectorModel>();
  columns: any = [];
  defaultSortType = 'lastname';
  defaultSortDirection = 'asc';
  selectedClients: Array<ClientSelectorModel> = [];
  getRowClassBound: Function;

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  clientNumber = new FormControl();
  name = new FormControl();
  lastname = new FormControl();
  email = new FormControl();
  province = new FormControl();

  constructor(
              private clientSelectorService: ClientSelectorService,
              private notificationBar: NotificationBarService,
              private router: Router,
              private translate: TranslateService,
              private clientSelectorColumns: ClientSelectorColumns) {
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
      this.clientSelectorColumns.clientNumberColumn(),
      this.clientSelectorColumns.nameColumn(),
      this.clientSelectorColumns.lastnameColumn(),
      this.clientSelectorColumns.emailColumn(),
      this.clientSelectorColumns.provinceColumn(),
    ];

    this.onSearch();
  }

  clearSearchForm(): void {

    // Set Form Controls
    this.clientNumber.setValue('');
    this.clientNumber.markAsPristine();
    this.name.setValue('');
    this.name.markAsPristine();
    this.lastname.setValue('');
    this.lastname.markAsPristine();
    this.email.setValue('');
    this.email.markAsPristine();
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
    this.clientSelectorService
      .getClients(this.page)
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
    this.page.filters.clientNumber = this.clientNumber.value;
    this.page.filters.name = this.name.value;
    this.page.filters.lastname = this.lastname.value;
    this.page.filters.email = this.email.value;
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

  toggleSelected(client: ClientSelectorModel): void {
    if (this.isSelected(client)) {
      this.selectedClients = this.selectedClients.filter(selCart => selCart.clientNumber !== client.clientNumber);
    } else {
      if (this.multipleSelection) {
        this.selectedClients.push(client);
      } else {
        this.selectedClients = [client];
      }
    }
    this.onSelectionChange.emit(this.selectedClients.slice());
  }

  isSelected(client: ClientSelectorModel): boolean {
    return this.selectedClients.some((selCart) => client.clientNumber === selCart.clientNumber);
  }

  getRowClass(client: ClientSelectorModel) {
    return {
      'selected-row': this.isSelected(client)
    };
  }

  resetSelected(): void {
    this.selectedClients = [];
    this.onSelectionChange.emit(this.selectedClients.slice());
  }
}
