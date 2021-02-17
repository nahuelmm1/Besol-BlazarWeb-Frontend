import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate';
import { Page } from '../../../shared/models/page.model';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { UserByStateItem } from '../../model/user-by-state.model';
import { UserService } from '../../service/user.service';
import { UserAdminColumns } from '../../shared/user-admin-columns';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';

@Component({
    moduleId: module.id,
    selector: 'user-picker',
    templateUrl: 'user-picker.component.html',
    styleUrls: ['user-picker.component.scss']
})
export class UserPickerComponent implements OnInit {
    @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;
    dialogueTitle: string = this.translateService.instant(' add user');


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
    groupId: number = 0;

    translateMessages = {
        emptyMessage: this.translateService.instant('no data to display'),
    };

    filter = new FormControl();

    constructor(private dialogRef: MdDialogRef<UserPickerComponent>,
        private translateService: TranslateService,
        private userService: UserService,
        private userAdminColumns: UserAdminColumns,
        private notificationBar: NotificationBarService,
        private localStorageService: LocalStorageService) { }

    ngOnInit(): void {
        this.page.pageNumber = 0;
        this.page.size = this.localStorageService.getComputerSettings().pageSize;
        this.page.filters.sortType = this.defaultSortType;
        this.page.filters.sortDirection = this.defaultSortDirection;
        this.page.filters.filter = '';
        this.page.filters.groupId = this.groupId;
        this.getRowClassBound = this.getRowClass.bind(this);
        this.initSearchForm(this.page);

        this.fixedColumns = [
            {
                cellTemplate: this.selectedCellTemplate,
                width: 39,
                sortable: false,
                cellClass: 'Cell--selectedMark'
            },
            this.userAdminColumns.userNameColumn(),
            this.userAdminColumns.mailColumn(),
            this.userAdminColumns.nameColumn(),
            this.userAdminColumns.surnameColumn()
        ];
        this.columns = [...this.fixedColumns];
    }

    initSearchForm(page: Page): void {
        this.page.pageNumber = page.pageNumber;
        this.page.size = page.size;
        this.page.filters.sortType = page.filters.sortType;
        this.page.filters.sortDirection = page.filters.sortDirection;
        this.page.filters.filter = page.filters.filter;
        this.page.filters.groupId = this.page.filters.groupId;

        // Set Form Controls
        this.filter.setValue(page.filters.filter);
        this.filter.markAsPristine();
    }

    loadPage() {
        this.loading = true;

        this.userService
            .getUserByGroup(this.page)
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

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.loadPage();
    }

    onSort(sortInfo) {
        this.page.filters.sortType = sortInfo.column.prop;
        this.page.filters.sortDirection = sortInfo.newValue;
        this.loadPage();
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

    onSearch(): void {
        this.loading = true;
        this.page.pageNumber = 0;
        this.page.filters.filter = this.filter.value;

        this.resetSelected();
        this.loadPage();
    }

    onKeypress($event): void {
        if ($event.key === 'Enter') {
            this.onSearch();
            $event.preventDefault();
        }
    }

    onOk() {
        this.dialogRef.close({ user: this.selectedRows[0] });
    }

    onClose() {
        this.dialogRef.close();
    }

}
