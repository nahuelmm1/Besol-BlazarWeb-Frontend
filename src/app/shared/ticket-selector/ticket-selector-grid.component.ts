import { Component, OnInit, Input, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as moment from 'moment';

import { TicketSelectorService } from './ticket-selector.service';
import { Page } from '../models/page.model';
import { TicketSelectorModel } from './ticket-selector.model';
import { PointOfSaleModel } from '../models/point-of-sale.model';

import { TranslateService } from '../../core/translate/translate.service';
import { PointOfSaleService } from '../point-of-sale.service';
import { TicketSelectorColumns } from './ticket-selector-columns';
import { Router } from '@angular/router';
import { NotificationBarService } from '../notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  selector: 'ticket-selector-grid',
  templateUrl: 'ticket-selector-grid.component.html'
})

export class TicketSelectorGridComponent implements OnInit {
  @Input() multipleSelection: boolean;
  @Input() filter: any;
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @Output() onSelectionChange = new EventEmitter<Array<TicketSelectorModel>>();

  page = new Page();
  loading: boolean = false;
  rows = new Array<TicketSelectorModel>();
  columns: any = [];
  defaultSortType = 'date';
  defaultSortDirection = 'desc';
  selectedTickets: Array<TicketSelectorModel> = [];
  getRowClassBound: Function;

  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  dateFrom = new FormControl();
  dateTo = new FormControl();
  ticketNumber = new FormControl();
  name = new FormControl();
  lastname = new FormControl();
  user = new FormControl();
  pointOfSale = new FormControl();
  pointsOfSale: Array<PointOfSaleModel> = [];
  amountFrom = new FormControl();
  amountTo = new FormControl();

    // MachineInfo
    machinePos: PointOfSaleModel;

  constructor(
              private ticketSelectorService: TicketSelectorService,
              private notificationBar: NotificationBarService,
              private router: Router,
              private translate: TranslateService,
              private ticketSelectorColumns: TicketSelectorColumns,
              private pofService: PointOfSaleService) {

    this.page.pageNumber = 0;
    this.page.size = 5;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.getRowClassBound = this.getRowClass.bind(this);
  }

  ngOnInit(): void {
    this.clearSearchForm();
    this.initPointsOfSale();

    this.columns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 50,
        sortable: false
      },
      this.ticketSelectorColumns.ticketNumberColumn(),
      this.ticketSelectorColumns.dateColumn(),
      this.ticketSelectorColumns.nameColumn(),
      this.ticketSelectorColumns.lastnameColumn(),
      this.ticketSelectorColumns.userColumn(),
      this.ticketSelectorColumns.amountColumn(),
      this.ticketSelectorColumns.pointOfSaleColumn(),
    ];
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
    this.ticketNumber.setValue('');
    this.ticketNumber.markAsPristine();
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

    this.pointOfSale.setValue(this.page.filters.pointOfSaleId);
    this.pointOfSale.markAsPristine();
    this.amountFrom.setValue('');
    this.amountFrom.markAsPristine();
    this.amountTo.setValue('');
    this.amountTo.markAsPristine();
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

  onSort(sortInfo) {
    this.page.filters.sortType = sortInfo.column.prop;
    this.page.filters.sortDirection = sortInfo.newValue;
    this.loadPage();
  }

  loadPage() {
    this.loading = true;
    this.ticketSelectorService
      .getTickets(this.page)
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
    this.page.filters.ticketNumber = this.ticketNumber.value;
    this.page.filters.name = this.name.value;
    this.page.filters.lastname = this.lastname.value;
    this.page.filters.user = this.user.value;
    this.page.filters.pointOfSaleId = this.pointOfSale.value;
    this.page.filters.amountFrom = this.amountFrom.value;
    this.page.filters.amountTo = this.amountTo.value;

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

  toggleSelected(ticket: TicketSelectorModel): void {
    if (this.isSelected(ticket)) {
      this.selectedTickets = this.selectedTickets.filter(selTicket => selTicket.ticketNumber !== ticket.ticketNumber);
    } else {
      if (this.multipleSelection) {
        this.selectedTickets.push(ticket);
      } else {
        this.selectedTickets = [ticket];
      }
    }
    this.onSelectionChange.emit(this.selectedTickets.slice());
  }

  isSelected(ticket: TicketSelectorModel): boolean {
    return this.selectedTickets.some((selTicket) => ticket.ticketNumber === selTicket.ticketNumber);
  }

  getRowClass(ticket: TicketSelectorModel) {
    return {
      'selected-row': this.isSelected(ticket)
    };
  }

  resetSelected(): void {
    this.selectedTickets = [];
    this.onSelectionChange.emit(this.selectedTickets.slice());
  }
}
