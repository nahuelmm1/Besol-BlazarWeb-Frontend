import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Page } from '../../shared/models/page.model';
import { CartByStateItem } from '../../cart/model/cart-by-state.model';
import { TranslateService } from '../../core/translate/translate.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { ReassignCartModalService } from '../../shared/reassign-cart';
import { UserAdminColumns } from '../shared/user-admin-columns';
import { UserByStateItem } from '../model/user-by-state.model';
import { UserService } from '../service/user.service';
import { MdDialog } from '@angular/material';
import { UserDialogueComponent } from './dialogue/user-dialogue.component';
import { ParameterService } from '../../admin/parameters/parameter.service';
import { ClientStatsModalService } from '../../shared/client-stats/client-stats-modal.service';
import { Response } from '@angular/http';

const STATE_MAP = [];
const PAGE_KEY = 'userByState';
const GROUP_CATALOG_KEY = 'GrupoCatalogoDigital';

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
  templateUrl: 'user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @ViewChild('userActiveCellTemplate') userActiveCellTemplate: TemplateRef<any>;
  @ViewChild('userBuyerCellTemplate') userBuyerCellTemplate: TemplateRef<any>;
  @ViewChild('userCartHistoryCellTemplate') userCartHistoryCellTemplate: TemplateRef<any>;
  @ViewChild('userBuyerExpressCellTemplate') userBuyerExpressCellTemplate: TemplateRef<any>;
  @ViewChild('userPenalizeCellTemplate') userPenalizeCellTemplate: TemplateRef<any>;
  @ViewChild('userGroupCatalogCellTemplate') userGroupCatalogCellTemplate: TemplateRef<any>;
  @ViewChild('searchCellTemplate') searchCellTemplate: TemplateRef<any>;
  @ViewChild('keyCellTemplate') keyCellTemplate: TemplateRef<any>;
  @ViewChild('debtCellTemplate') debtCellTemplate: TemplateRef<any>;
  @ViewChild('rankingCellTemplate') rankingCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<UserByStateItem>();
  fixedColumns: any = [];
  columns: any = [];
  assigneeColumn: any;
  mailColumn: any;
  defaultSortType = 'surname name';
  defaultSortDirection = 'asc';
  selectedRows: Array<UserByStateItem> = [];
  getRowClassBound: Function;
  isClaimPaymentVisible: boolean = false;
  isTrackNumberVisible: boolean = false;
  isActive: boolean;
  isBuyer: boolean;
  groupCatalogId: string;

  translateMessages = {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  userActive = new FormControl();
  userState = new FormControl();
  filter = new FormControl();

  constructor(
    private userService: UserService,
    private notificationBar: NotificationBarService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private userAdminColumns: UserAdminColumns,
    private reassignCartModalService: ReassignCartModalService,
    public dialogService: MdDialog,
    private pageLoaderService: PageLoaderService,
    private appConfigService: ParameterService,
    private clientStatsModalService: ClientStatsModalService
  ) { }

  ngOnInit(): void {
    this.isActive = false;
    this.isBuyer = false;

    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.page.filters.filter = '';
    this.page.filters.catalogGroupId = this.groupCatalogId;
    this.getRowClassBound = this.getRowClass.bind(this);

    const prevPageState = this.userService.getPagePrevState(PAGE_KEY);
    this.initSearchForm(prevPageState || this.page);
    this.getCatalogGroupId();

    this.fixedColumns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 39,
        sortable: false,
        cellClass: 'Cell--selectedMark'
      },
      {
        name: this.translate.instant('userName'),
        prop: 'userName',
        cellTemplate: this.userCartHistoryCellTemplate,
        width: 220,
        sortable: true,
        cellClass: 'Cell--strechSidePadding',
        headerClass: 'Cell--strechSidePadding'
      },
      this.userAdminColumns.mailColumn(),
      this.userAdminColumns.nameColumn(),
      this.userAdminColumns.surnameColumn(),
      this.userAdminColumns.provinceColumn(),
      {
        name: this.translate.instant('active|short'),
        prop: 'active',
        cellTemplate: this.userActiveCellTemplate,
        width: 45,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('Buyer|short'),
        prop: 'Buyer',
        cellTemplate: this.userBuyerCellTemplate,
        width: 45,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('BuyerExpress|short'),
        prop: 'BuyerExpress',
        cellTemplate: this.userBuyerExpressCellTemplate,
        width: 45,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('penalize|short'),
        prop: 'penalize',
        cellTemplate: this.userPenalizeCellTemplate,
        width: 45,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('catalogGroupAssigned|short'),
        prop: 'IsCatalogGroupAssigned',
        cellTemplate: this.userGroupCatalogCellTemplate,
        width: 150,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      this.userAdminColumns.registerDateColumn(),
      this.userAdminColumns.lastAccessDateColumn(),
      {
        name: this.translate.instant('detail'),
        prop: 'detail',
        cellTemplate: this.searchCellTemplate,
        width: 90,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('update key'),
        prop: 'key',
        cellTemplate: this.keyCellTemplate,
        width: 130,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('debt'),
        prop: 'debt',
        cellTemplate: this.debtCellTemplate,
        width: 80,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('ranking'),
        cellTemplate: this.rankingCellTemplate,
        width: 130,
        sortable: false,
        cellClass: 'u-textCenter Cell--strechSidePadding',
        headerClass: 'u-textCenter Cell--strechSidePadding'
      },
    ];
    this.columns = [...this.fixedColumns];
  }

  getCatalogGroupId(): any {
    this.appConfigService
    .getAll()
    .subscribe(
      (parameterArray) => {
        this.groupCatalogId = parameterArray.find(group => group.key === GROUP_CATALOG_KEY).value;
        this.page.filters.catalogGroupId = this.groupCatalogId;
        this.loadPage();
      },
      err => this.notificationBar.error(err)
    );
  }

  initSearchForm(page: Page): void {
    this.page.pageNumber = page.pageNumber;
    this.page.size = page.size;
    this.page.filters.sortType = page.filters.sortType;
    this.page.filters.sortDirection = page.filters.sortDirection;
    this.page.filters.filter = page.filters.filter;
    this.page.filters.userActive = ( ( page.filters.userActive !== undefined ) ? page.filters.userActive : true );
    this.page.filters.userState = ( ( page.filters.userState !== undefined ) ? page.filters.userState : true );

    // Set Form Controls
    this.userActive.setValue(!this.page.filters.userActive);
    this.userActive.markAsPristine();
    this.userState.setValue(!this.page.filters.userState);
    this.userState.markAsPristine();
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

  clickUser($event, userId: any): void {
    this.clientStatsModalService.show(userId);
    $event.preventDefault();
  }


  loadPage() {
    this.loading = true;

    this.userService
      .getUserReport(this.page)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        pagedData => this.bindOnSuccess(pagedData),
        err => this.notificationBar.error(err)
      );
    this.userService.setPagePrevState(PAGE_KEY, this.page);
  }

  onUserStateChange(): void {
    this.loading = true;
    this.page.filters.userState = !this.userState.value;
    this.resetSelected();
  }

  onUserActiveChange(): void {
    this.loading = true;
    this.page.filters.userActive = !this.userActive.value;
    this.resetSelected();
  }

  onSearch(): void {
    this.loading = true;
    this.page.pageNumber = 0;
    this.page.filters.userActive = !this.userActive.value;
    this.page.filters.userState = !this.userState.value;
    this.page.filters.filter = this.filter.value;
    this.page.filters.catalogGroupId = this.groupCatalogId;

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

  toggleSelected(user: UserByStateItem): void {
    if (this.isSelected(user)) {
      this.selectedRows = this.selectedRows.filter(selected => selected.id !== user.id);
    } else {
      this.selectedRows = [user];
    }
  }

  isSelected(user: UserByStateItem): boolean {
    return this.selectedRows.some((selected) => user.id === selected.id);
  }

  getRowClass(user: UserByStateItem) {
    return {
      'selected-row': this.isSelected(user)
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

  onDetail(user: UserByStateItem) {
    const id = user.id;
    this.router.navigate(['security/users/detail', id]);
  }

  onUpdatePassword(user: UserByStateItem) {
    const id = user.id;
    this.router.navigate(['security/users/password', id]);
  }

  onUpdateDebt(user: UserByStateItem) {
    const id = user.id;
    this.router.navigate(['security/users/debt', id]);
  }

  onActive(user: UserByStateItem) {

    const dialogRef = this.dialogService.open(UserDialogueComponent, { width: '30%' });
    dialogRef.componentInstance.dialogueTitle = this.translate.instant('user activate title');
    dialogRef.componentInstance.dialogueAdditionalMessage = user.surname + ', ' + user.name;

    if (user.isActive) {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user deactivate message');
    } else {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user activate message');
    }

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.onUpdateUserState(user);
        }
      });
  }

  onUpdateUserState(user: UserByStateItem) {
    this.pageLoaderService.setPageLoadingStatus(true);

    this.userService.updateState(user).subscribe(
      (response) => {
        user.isActive = !user.isActive;
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  onBuyer(user: UserByStateItem) {

    const dialogRef = this.dialogService.open(UserDialogueComponent, { width: '30%' });
    dialogRef.componentInstance.dialogueTitle = this.translate.instant('user activate title');
    dialogRef.componentInstance.dialogueAdditionalMessage = user.surname + ', ' + user.name;

    if (user.isBuyer) {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user remove buyer group message');
    } else {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user add buyer group message');
    }

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.onUpdateBuyerState(user);
        }
      });
  }

  onUpdateBuyerState(user: UserByStateItem) {
    this.pageLoaderService.setPageLoadingStatus(true);

    this.userService.updateBuyerState(user).subscribe(
      (response) => {
       user.isBuyer = !user.isBuyer;
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  onBuyerExpress(user: UserByStateItem) {

    const dialogRef = this.dialogService.open(UserDialogueComponent, { width: '30%' });
    dialogRef.componentInstance.dialogueTitle = this.translate.instant('user activate title');
    dialogRef.componentInstance.dialogueAdditionalMessage = user.surname + ', ' + user.name;

    if (user.isBuyerExpress) {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user remove group buyer express message');
    } else {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user add buyer express group message');
    }

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.onUpdateBuyerExpressState(user);
        }
      });
  }

  onUpdateBuyerExpressState(user: UserByStateItem) {
    this.pageLoaderService.setPageLoadingStatus(true);

    this.userService.updateBuyerExpressState(user).subscribe(
      (response) => {
        user.isBuyerExpress = !user.isBuyerExpress;
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  onGroupCatalog(user: UserByStateItem) {

    const dialogRef = this.dialogService.open(UserDialogueComponent, { width: '30%' });
    dialogRef.componentInstance.dialogueTitle = this.translate.instant('user activate title');
    dialogRef.componentInstance.dialogueAdditionalMessage = user.surname + ', ' + user.name;

    if (user.isCatalogGroupAssigned) {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user remove catalog group message');
    } else {
      dialogRef.componentInstance.dialogueMessage = this.translate.instant('user add catalog group message');
    }

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          user.isCatalogGroupAssigned = !user.isCatalogGroupAssigned;
          this.onUpdateGroupCatalogState(user);
        }
      });
  }

  onUpdateGroupCatalogState(user: UserByStateItem) {
    this.pageLoaderService.setPageLoadingStatus(true);

    this.userService.onUpdateGroupCatalogState(user).subscribe(
      (response) => {
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
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

  onKeypress($event): void {
    if ($event.key === 'Enter') {
      this.onSearch();
      $event.preventDefault();
    }
  }
}
