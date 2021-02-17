import { TemplateRef, ViewChild, OnInit, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../shared/local-storage.service';
import { TranslateService } from '../../core/translate/translate.service';
import { MdDialog } from '@angular/material';
import { Page } from '../../shared/models/page.model';
import { GroupByStateItem } from '../model/group-by-state.model';
import { GroupAdminColumns } from '../shared/group-admin.columns';
import { GroupService } from '../service/group.service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { MessageDialogueComponent } from './dialogue/message-dialogue.component';
import { UserDialogueComponent } from '../user/dialogue/user-dialogue.component';
import { Subscription } from 'rxjs/Subscription';

const PAGE_KEY = 'groupByState';


@Component({
  moduleId: module.id,
  templateUrl: 'group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
  @ViewChild('groupManageOrderCellTemplate') groupManageOrderCellTemplate: TemplateRef<any>;

  page = new Page();
  loading: boolean = false;
  rows = new Array<GroupByStateItem>();
  fixedColumns: any = [];
  columns: any = [];
  assigneeColumn: any;
  mailColumn: any;
  defaultSortType = 'name';
  defaultSortDirection = 'asc';
  selectedRows: Array<GroupByStateItem> = [];
  getRowClassBound: Function;
  private groupServiceSuscription: Subscription;

  translateMessages = {
    emptyMessage: this.translate.instant('no data to display'),
  };

  // filters
  filter = new FormControl();

  constructor(
    private groupService: GroupService,
    private notificationBar: NotificationBarService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private pageLoaderService: PageLoaderService,
    private groupAdminColumns: GroupAdminColumns,
    private router: Router,
    public dialogService: MdDialog,
  ) { }

  ngOnInit(): void {

    this.page.pageNumber = 0;
    this.page.size = this.localStorageService.getComputerSettings().pageSize;
    this.page.filters.sortType = this.defaultSortType;
    this.page.filters.sortDirection = this.defaultSortDirection;
    this.page.filters.filter = '';
    this.getRowClassBound = this.getRowClass.bind(this);

    const prevPageState = this.groupService.getPagePrevState(PAGE_KEY);
    this.initSearchForm(prevPageState || this.page);
    this.loadPage();

    this.fixedColumns = [
      {
        cellTemplate: this.selectedCellTemplate,
        width: 5,
        sortable: false,
        cellClass: 'Cell--selectedMark'
      },
      this.groupAdminColumns.nameColumn(),
      this.groupAdminColumns.descriptionColumn()
    ];
    this.columns = [...this.fixedColumns];
  }

  ngOnDestroy(): void {
    if (this.groupServiceSuscription) {
      this.groupServiceSuscription.unsubscribe();
    }
  }

  initSearchForm(page: Page): void {
    this.page.pageNumber = page.pageNumber;
    this.page.size = page.size;
    this.page.filters.sortType = page.filters.sortType;
    this.page.filters.sortDirection = page.filters.sortDirection;
    this.page.filters.filter = page.filters.filter;

    // Set Form Controls
    this.filter.setValue(page.filters.filter);
    this.filter.markAsPristine();
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
    this.loading = true;

    this.groupServiceSuscription = this.groupService
      .getGroupReport(this.page)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(
        pagedData => this.bindOnSuccess(pagedData),
        err => this.notificationBar.error(err)
      );
    this.groupService.setPagePrevState(PAGE_KEY, this.page);
  }

  onSearch(): void {
    this.loading = true;
    this.page.pageNumber = 0;
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
        this.selectedRows = [activateInfo.row];
      }
      this.onEdit();
    }
  }

  toggleSelected(group: GroupByStateItem): void {
    if (this.isSelected(group)) {
      this.selectedRows = this.selectedRows.filter(selected => selected.groupId !== group.groupId);
    } else {
      this.selectedRows = [group];
    }
  }

  isSelected(group: GroupByStateItem): boolean {
    return this.selectedRows.some((selected) => group.groupId === selected.groupId);
  }

  getRowClass(group: GroupByStateItem) {
    return {
      'selected-row': this.isSelected(group)
    };
  }

  resetSelected(): void {
    this.selectedRows = [];
  }

  hasSelection(): boolean {
    return this.selectedRows.length > 0;
  }

  onAdd() {
    this.router.navigate(['security/group/detail']);
  }

  onEdit() {
    const id = this.selectedRows[0].groupId;
    this.router.navigate(['security/group/detail', id]);
  }

  onDelete() {
    const groupId = this.selectedRows[0].groupId;
    this.pageLoaderService.setPageLoadingStatus(true);

    this.groupServiceSuscription = this.groupService.isEmptyGroup(groupId).subscribe(
      (response) => {
        if (response === false) {

          const dialogRef = this.dialogService.open(MessageDialogueComponent, { width: '30%' });
          dialogRef.componentInstance.dialogueTitle = this.translate.instant('application name');
          dialogRef.componentInstance.dialogueMessage = this.translate.instant('group not empty');

        } else {
          this.deleteGroup(groupId);
        }

        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  deleteGroup(groupid: number) {

    const dialogRef = this.dialogService.open(UserDialogueComponent, { width: '30%' });
    dialogRef.componentInstance.dialogueTitle = this.translate.instant('application name');
    dialogRef.componentInstance.dialogueAdditionalMessage = this.selectedRows[0].name;
    dialogRef.componentInstance.dialogueMessage = this.translate.instant('group delete message');

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.onDeleteGroup(groupid);
        }
      });
  }

  onDeleteGroup(groupid: number) {
    this.pageLoaderService.setPageLoadingStatus(true);

    this.groupServiceSuscription = this.groupService.delete(groupid).subscribe(
      (response) => {
        this.loadPage();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
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
