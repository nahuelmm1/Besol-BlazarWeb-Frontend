import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { LogDetailDialogueComponent  } from './log-detail-dialogue.component';

import { LogService } from './log.service';
import { TranslateService } from '../../core/translate/translate.service';

import { Page } from '../../shared/models/page.model';
import { PagedData } from '../../shared/models/page-data.model';
import { Log } from './log.model';

import { Observable } from 'rxjs/Observable';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';

@Component({
  moduleId: module.id,
  templateUrl: 'log-list.component.html',
  styleUrls: ['log-list.component.css']
})

export class LogListComponent implements OnInit {
  @ViewChild('searchEl') searchEl: ElementRef;
  page: Page = new Page();
  loading: boolean = false;
  rows: Log[] = new Array<Log>();
  checkboxGroup: FormGroup;
  columns = [
    { name: this.translate.instant('appLogId'), prop: 'appLogId', width: 100 }, // frozenLeft: true },
    { name: this.translate.instant('applicationName'), prop: 'applicationName', width: 150 },
    { name: this.translate.instant('type'), prop: 'type', width: 110 },
    { name: this.translate.instant('url'), prop: 'url', width: 250 },
    { name: this.translate.instant('message'), prop: 'message', width: 300 },
    { name: this.translate.instant('jsonData'), prop: 'jsonData', width: 300 },
    { name: this.translate.instant('stackTrace'), prop: 'stackTrace', width: 300 },
    { name: this.translate.instant('userAgent'), prop: 'userAgent', width: 165 },
    { name: this.translate.instant('userName'), prop: 'userName', width: 250 },
    { name: this.translate.instant('clientIpAddress'), prop: 'clientIpAddress' , width: 200 },
    { name: this.translate.instant('clientTimeStamp'), prop: 'clientTimeStamp' , width: 200 },
  ];
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
    totalMessage: this.translate.instant('total')
  };

  search: FormControl = new FormControl();
  pageSize: FormControl = new FormControl();

  selectedLog: Log = null;

  constructor(private logService: LogService,
              public renderer: Renderer,
              private notificationBar: NotificationBarService,
              public dialogService: MdDialog,
              private translate: TranslateService,
              private fb: FormBuilder) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    const checkboxArray = new FormArray([
      new FormControl(true),
      new FormControl(true),
      new FormControl(true),
      new FormControl(true),
      new FormControl(true)]);
    this.checkboxGroup = this.fb.group({
      filters: checkboxArray
    });
    this.setPage({ offset: 0 });
    this.setPageSearch();
    this.pageSize.valueChanges.subscribe((val: number) => {
      this.page.size = +val;
    });
  }

  toggleFilter(showSearch: boolean) {
    if (showSearch) {
      setTimeout(() => {
        this.renderer.invokeElementMethod(
          this.searchEl.nativeElement, 'focus', []);
      }, 100);
    }
    if (!showSearch && this.search.dirty && this.search.value !== '') {
      this.page.filter = '';
      this.search.setValue('');
      this.search.markAsPristine();
    }
  }

  cleanLog(): void {
    this.loading = true;
    this.logService.cleanLogs().subscribe(() => {
      this.loading = false;
      this.page = new Page();
      this.rows = [];
    }, err => {
      this.notificationBar.error(err);
      this.loading = false;
    });
  }

  setPage(pageInfo: any): void {
    this.loading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.filters = this.checkboxGroup.controls['filters']['controls'].map(filter => filter.value);
    this.logService.getLogs(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          (pagedData) => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        },
        (err) => this.notificationBar.error(err)
      );
  }

  onSort(event: any): void {
    this.loading = true;
    const orderChar = (event.newValue === 'asc') ? '' : '-';
    this.page.order = `${orderChar}${event.column.prop}`;
    this.page.pageNumber = 0;

    this.logService.getLogs(this.page)
        .finally(() => {
          this.loading = false;
        })
        .subscribe(
          (pagedData) => {
          this.page = pagedData.page;
          this.rows = pagedData.data;
        },
        (err) => this.notificationBar.error(err)
      );
  }

  setPageSearch(): void {
    this.search.valueChanges
        .debounceTime(500)
        .distinctUntilChanged()
        .switchMap(filter => {
          this.loading = true;
          this.page.pageNumber = 0;
          this.page.filter = filter;
          return this.logService.getLogs(this.page)
                                .catch(err => {
                                  return Observable.of(err);
                                });
        })
        .subscribe(
          (data: PagedData<Log> | string) => {
            if (data instanceof PagedData) {
              this.page = data.page;
              this.rows = data.data;
              this.loading = false;
            } else {
              this.notificationBar.error(data);
              this.loading = false;
            }
          },
        );
    this.checkboxGroup.valueChanges
        .switchMap(filters => {
          this.loading = true;
          this.page.pageNumber = 0;
          this.page.filters = filters.filters;
          return this.logService.getLogs(this.page)
                                .catch(err => {
                                  return Observable.of(err);
                                });
        }).subscribe(
          (data: PagedData<Log> | string) => {
            if (data instanceof PagedData) {
              this.page = data.page;
              this.rows = data.data;
              this.loading = false;
            } else {
              this.notificationBar.error(data);
              this.loading = false;
            }
          },
        );
  }

  getRowHeight(row: any): void {
    return row.height;
  }

  onActivate(event: any): void {
    const dialogRef = this.dialogService.open(LogDetailDialogueComponent, { width: '60%'});
    dialogRef.componentInstance.log = event.row;
    dialogRef.componentInstance.excludedKeys = (key) => key !== '$$index'; // && key !== 'jsonData';
  }

}
