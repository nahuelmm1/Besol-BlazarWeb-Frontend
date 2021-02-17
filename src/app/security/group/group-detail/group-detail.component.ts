import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../../shared/page-loader-service';
import { UserService } from '../../service/user.service';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { OnInit, ViewChild, ElementRef, Component, TemplateRef, OnDestroy } from '@angular/core';
import { Seller } from '../../../shared/models/seller.model';
import { Observable } from 'rxjs/Observable';
import { GroupService } from '../../service/group.service';
import { GroupModel } from '../../../cart/model/Group.model';
import { TranslateService } from '../../../core/translate';
import { MessageDialogueComponent } from '../dialogue/message-dialogue.component';
import { UserDialogueComponent } from '../../user/dialogue/user-dialogue.component';
import { Page } from '../../../shared/models/page.model';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { UserGroupModel } from '../../../cart/model/user-group.model';
import { UserAdminColumns } from '../../shared/user-admin-columns';
import { UserPickerComponent } from '../dialogue/user-picker.component';
import { Subscription } from 'rxjs/Subscription';
import { PagedData } from '../../../shared/models/page-data.model';
import { GroupByStateItem } from '../../model/group-by-state.model';


const PAGE_KEY = 'userGroupByState';

@Component({
    moduleId: module.id,
    templateUrl: 'group-detail.component.html',
    styleUrls: ['group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit, OnDestroy {
    @ViewChild('group') groupInput: ElementRef;
    @ViewChild('selectedCellTemplate') selectedCellTemplate: TemplateRef<any>;

    id: string;
    group: GroupModel = new GroupModel();
    groupForm: FormGroup;

    sellerList = new Array<Seller>();
    sellerSelectedValues = new Array<number>();
    sellerId = new FormControl();
    sellerToolTip = new Array<Seller>();

    loading: boolean = false;
    page = new Page();
    getRowClassBound: Function;
    selectedRows: Array<UserGroupModel> = [];
    rows = new Array<UserGroupModel>();
    defaultSortType = 'surname name';
    defaultSortDirection = 'asc';
    fixedColumns: any = [];
    columns: any = [];
    pagedData: PagedData<GroupByStateItem>;
    idsToFilter: Array<string> = new Array<string>();

    userGroupsToDelete: Array<UserGroupModel> = new Array<UserGroupModel>();
    userGroupsToAdd: Array<UserGroupModel> = new Array<UserGroupModel>();

    private groupServiceSuscription: Subscription;
    private userServiceSuscription: Subscription;


    translateMessages = {
        emptyMessage: this.translateService.instant('no data to display'),
    };

    constructor(
        private userService: UserService,
        private groupService: GroupService,
        private notificationBar: NotificationBarService,
        private router: Router,
        private route: ActivatedRoute,
        public dialogService: MdDialog,
        private pageLoaderService: PageLoaderService,
        private formBuilder: FormBuilder,
        private translateService: TranslateService,
        private localStorageService: LocalStorageService,
        private userAdminColumns: UserAdminColumns,
    ) { }

    ngOnInit(): void {

        this.page.pageNumber = 0;
        this.page.size = this.localStorageService.getComputerSettings().pageSize;
        this.page.filters.sortType = this.defaultSortType;
        this.page.filters.sortDirection = this.defaultSortDirection;
        this.page.filters.ids = this.idsToFilter;
        this.getRowClassBound = this.getRowClass.bind(this);
        this.initSearchForm(this.page);

        this.initForm();

        this.route.paramMap
            .switchMap((params: ParamMap) => {
                this.pageLoaderService.setPageLoadingStatus(true);
                this.id = params.get('id');

                if (this.id !== null) {
                    this.loadPage();
                    return this.groupService.getGroup(parseInt(this.id, 10));
                }

                return Observable.of(new GroupModel());
            })
            .subscribe(
                (group: GroupModel) => {
                    this.pageLoaderService.setPageLoadingStatus(false);
                    this.group = group;
                    this.setForm();
                    this.initSellers();
                },
                (err) => {
                    this.notificationBar.error(err);
                    this.pageLoaderService.setPageLoadingStatus(false);
                }
            );

        this.groupInput.nativeElement.focus();

        this.fixedColumns = [
            {
                cellTemplate: this.selectedCellTemplate,
                width: 19,
                sortable: false,
                cellClass: 'Cell--selectedMark'
            },
            {
                name: this.translateService.instant('user'),
                prop: 'username',
                width: 220,
                sortable: false,
                cellClass: 'Cell--strechSidePadding',
                headerClass: 'Cell--strechSidePadding'
            },
            {
                name: this.translateService.instant('email'),
                prop: 'email',
                width: 220,
                sortable: false,
                cellClass: 'Cell--strechSidePadding',
                headerClass: 'Cell--strechSidePadding'
            },
            {
                name: this.translateService.instant('name'),
                prop: 'name',
                width: 200,
                sortable: false,
                cellClass: 'Cell--strechSidePadding',
                headerClass: 'Cell--strechSidePadding'
            }, {
                name: this.translateService.instant('surname'),
                prop: 'surname',
                width: 200,
                sortable: false,
                cellClass: 'Cell--strechSidePadding',
                headerClass: 'Cell--strechSidePadding'
            }
        ];
        this.columns = [...this.fixedColumns];
    }

    ngOnDestroy(): void {
        if (this.groupServiceSuscription) {
            this.groupServiceSuscription.unsubscribe();
        }
        if (this.userServiceSuscription) {
            this.userServiceSuscription.unsubscribe();
        }

        this.resetSelectedUserGroup();
        this.resetSelected();
    }

    initForm(): void {

        this.groupForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });

        this.sellerId.valueChanges.subscribe(
            (value) => {
                this.sellerSelectedValues = value;
                this.updateTooltips();
            }
        );
    }

    initSearchForm(page: Page): void {
        this.page.pageNumber = page.pageNumber;
        this.page.size = page.size;
        this.page.filters.filter = page.filters.filter;
        this.page.filters.sortType = page.filters.sortType;
        this.page.filters.sortDirection = page.filters.sortDirection;
        this.page.filters.ids = page.filters.ids;
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

    resetSelected(): void {
        this.selectedRows = [];
    }

    resetSelectedUserGroup(): void {
        this.userGroupsToDelete = new Array<UserGroupModel>();
        this.userGroupsToAdd = new Array<UserGroupModel>();
        this.idsToFilter = new Array<string>();
        this.page.filters.ids = new Array<string>();
    }

    loadPage() {
        this.loading = true;
        const groupId = parseInt(this.id, 10);
        this.page.filters.ids = this.idsToFilter;

        this.groupServiceSuscription = this.groupService
            .getUserGroup(this.page, groupId)
            .finally(() => {
                this.loading = false;
            })
            .subscribe(
                pagedData => this.bindOnSuccess(pagedData),
                err => this.notificationBar.error(err)
            );
        this.groupService.setPagePrevState(PAGE_KEY, this.page);
    }

    bindOnSuccess(pagedData) {
        if (this.groupService.isLastPage(pagedData) &&
            (pagedData.page.totalElements < pagedData.page.size)) {
            pagedData.page.pageNumber = 0;
        }
        this.page = pagedData.page;
        this.rows = pagedData.data;
    }

    setForm(): void {

        this.groupForm.patchValue({
            name: this.group.name,
            description: this.group.description
        });
    }

    initSellers() {
        this.pageLoaderService.setPageLoadingStatus(true);
        this.userServiceSuscription = this.userService
            .getSellers().subscribe((sellerList) => {
                this.sellerList = sellerList;
                this.setSupliers();
                this.pageLoaderService.setPageLoadingStatus(false);
            },
                (error: string) => {
                    this.notificationBar.error(error);
                    this.pageLoaderService.setPageLoadingStatus(false);
                });
    }

    setSupliers() {
        this.setList();
        this.setTooltips();
    }

    setList() {
        const listOfSellers = this.group.sellers.map((seller: Seller) => this.getSellerSelectedId(seller.id));
        this.sellerId.setValue(listOfSellers);
    }

    setTooltips() {
        this.sellerToolTip = this.group.sellers.map((seller: Seller) => this.getSellerSelected(seller.id));
    }

    updateTooltips() {
        this.sellerToolTip = this.sellerSelectedValues.map((valueId: number) => new Seller().deserialize(this.getSellerSelected(valueId)))
    }

    getSellerSelected(sellerId: number): Seller {
        const sellerSelected = this.sellerList.find((suplier) => {
            return suplier.id === sellerId;
        });

        return (sellerSelected) ? sellerSelected : null;
    }

    getSellerSelectedId(sellerId: number): number {
        const sellerSelected = this.sellerList.find((suplier) => {
            return suplier.id === sellerId;
        });

        return (sellerSelected) ? sellerSelected.id : null;
    }

    handleActivate(activateInfo): void {
        if (activateInfo.type === 'click' && activateInfo.row) {
            this.toggleSelected(activateInfo.row);
        }
        if (activateInfo.type === 'dblclick' && activateInfo.row) {
            if (!this.isSelected(activateInfo.row)) {
                this.selectedRows = [activateInfo.row];
            }
            this.onRemoveDelete();
        }
    }

    toggleSelected(user: UserGroupModel): void {
        if (this.groupService.existIntoList(user, this.selectedRows)) {
            this.selectedRows = this.selectedRows.filter(selected => selected.id !== user.id);
        } else {
            this.selectedRows = [user];
        }
    }

    isSelected(user: UserGroupModel): boolean {
        return this.selectedRows.some((selected) => user.id === selected.id);
    }

    getRowClass(user: UserGroupModel) {
        return {
            'selected-row': this.groupService.existIntoList(user, this.selectedRows),
            'text-deleted-row': this.groupService.existIntoList(user, this.userGroupsToDelete),
            'text-added-row': this.groupService.existIntoList(user, this.userGroupsToAdd),
        };
    }

    hasSelection(): boolean {
        return this.selectedRows.length > 0;
    }

    onGoBack() {
        this.route.data.subscribe((value) => {
            this.router.navigate([value.navigateBack]);
        });
    }

    onRemoveDelete(): void {
        const user = this.selectedRows[0];
        if (this.groupService.notExistIntoList(user, this.userGroupsToDelete)) {
            return;
        }

        const dialogRef = this.dialogService.open(UserDialogueComponent, { width: '30%' });
        dialogRef.componentInstance.dialogueTitle = this.translateService.instant('application name');
        dialogRef.componentInstance.dialogueAdditionalMessage = this.selectedRows[0].username;
        dialogRef.componentInstance.dialogueMessage = this.translateService.instant('user group remove group revert message');

        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.doAction) {
                    if (this.groupService.existIntoList(user, this.userGroupsToDelete)) {
                        this.userGroupsToDelete = this.groupService.removeFrom(user, this.userGroupsToDelete);
                    }
                }
            });
    }

    onAddUserGroup(): void {
        const config = new MdDialogConfig();
        config.disableClose = true;
        config.hasBackdrop = true;
        config.width = '80%';
        config.height = '750px';

        const dialogRef = this.dialogService.open(UserPickerComponent, config);

        dialogRef.componentInstance.groupId = this.getGroupId();

        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result) {
                    const user = new UserGroupModel().deserialize(result.user);
                    if (this.groupService.notExistIntoList(user, this.userGroupsToAdd)) {
                        this.userGroupsToAdd.push(user);
                        this.idsToFilter.push(user.id.toString());
                        this.loadPage();
                    }
                }
            });
    }

    getGroupId(): number {
        return (this.id !== null) ? parseInt(this.id, 10) : 0;
    }

    onDelete(): void {
        const dialogRef = this.dialogService.open(UserDialogueComponent, { width: '30%' });
        dialogRef.componentInstance.dialogueTitle = this.translateService.instant('application name');
        dialogRef.componentInstance.dialogueAdditionalMessage = this.selectedRows[0].username;
        dialogRef.componentInstance.dialogueMessage = this.translateService.instant('user remove group message');

        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result && result.doAction) {
                    const user = this.selectedRows[0];
                    if (this.groupService.notExistIntoList(user, this.userGroupsToDelete)) {
                        if (this.groupService.notExistIntoList(user, this.userGroupsToAdd)) {
                            this.userGroupsToDelete.push(user);
                        } else {
                            this.userGroupsToAdd = this.groupService.removeFrom(user, this.userGroupsToAdd);
                            this.idsToFilter = this.groupService.removeStringFrom(user.id.toString(), this.idsToFilter);
                            this.page.pageNumber = (this.idsToFilter) ? 0 : this.page.pageNumber;
                            this.loadPage();
                        }
                    }
                }
            });
    }

    onUpdate(): void {
        if (this.id !== null) {
            this.updateGroupDetail();
        } else {
            this.addGroupDetail();
        }
    }

    addGroupDetail() {
        this.pageLoaderService.setPageLoadingStatus(true);
        this.groupServiceSuscription = this.groupService
            .add(this.buildGroup()).subscribe((resp: any) => {
                this.pageLoaderService.setPageLoadingStatus(false);
                this.resetSelectedUserGroup();
                this.onAddGroupSuccess();
            },
                (error: string) => {
                    this.notificationBar.error(error);
                    this.pageLoaderService.setPageLoadingStatus(false);
                });
    }

    onAddGroupSuccess() {

        const dialogRef = this.dialogService.open(MessageDialogueComponent, { width: '30%' });
        dialogRef.componentInstance.dialogueTitle = this.translateService.instant('application name');
        dialogRef.componentInstance.dialogueMessage = this.translateService.instant('group created with success');

        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.doAction) {
                    this.router.navigate(['security/group']);
                }
            });
    }

    updateGroupDetail() {
        this.pageLoaderService.setPageLoadingStatus(true);
        this.groupServiceSuscription = this.groupService
            .edit(this.buildGroup()).subscribe((group) => {
                this.group = group;
                this.resetSelectedUserGroup();
                this.setForm();
                this.setSupliers();
                this.page.pageNumber = 0;
                this.loadPage();
                this.pageLoaderService.setPageLoadingStatus(false);
                this.notificationBar.success('group details updated with success');
            },
                (error: string) => {
                    this.notificationBar.error(error);
                    this.pageLoaderService.setPageLoadingStatus(false);
                });
    }

    buildGroup(): GroupModel {
        const groupForm = this.groupForm.value;

        const groupValues = {
            groupId: (this.id !== null) ? parseInt(this.id, 10) : 0,
            name: groupForm.name,
            description: groupForm.description,
            sellers: this.sellerSelectedValues.map((valueId: number) => new Seller().deserialize(this.getSellerSelected(valueId))),
            userGroups: this.getUserGroups()
        };

        return new GroupModel().deserialize(groupValues);
    }

    private getUserGroups() {
        const array = this.userGroupsToDelete.concat(this.userGroupsToAdd);
        const uniqueValues = Array.from(new Set(array));
        return uniqueValues;
    }
}
