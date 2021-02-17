import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { PagedData } from '../../shared/models/page-data.model';
import { Page } from '../../shared/models/page.model';
import { LoggingService } from '../../core/logging/logging.service';
import { GroupByStateItem } from '../model/group-by-state.model';
import { GroupModel } from '../../cart/model/Group.model';
import { UserGroupModel } from '../../cart/model/user-group.model';


const pagePrevStates: any = {};

@Injectable()
export class GroupService {

  constructor(private http: Http,
    private logService: LoggingService) { }

  getGroupReport(page: Page): Observable<PagedData<GroupByStateItem>> {
    try {

      const params = {
        limit: page.size,
        page: page.pageNumber + 1,

        isManageOrder: page.filters.isManageOrder,
        filter: page.filters.filter || '',
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection,
      };

      return this.http.post(`${environment.API}api/group/bystate`, JSON.stringify(params))
        .map((res: Response) => {
          const pagedData = new PagedData<GroupByStateItem>();
          page.totalElements = res.json().total;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = res.json().items.map((item: any) => {
            return new GroupByStateItem().deserialize(item);
          });
          pagedData.page = page;
          return pagedData;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('GroupService.getGroupReport - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  removeFromUserGroup(page: Page, rows: UserGroupModel[], user: UserGroupModel): PagedData<UserGroupModel> {
    const pagedData = new PagedData<UserGroupModel>();
    page.totalElements = page.totalElements - 1;

    rows = this.removeFrom(user, rows);

    pagedData.data = [...rows];
    pagedData.page = page;
    return pagedData;
  }

  removeFrom(value: UserGroupModel, list: UserGroupModel[]): UserGroupModel[] {
    const index = list.findIndex(x => x.id === value.id);
    if (index > -1) {
      list.splice(index, 1);
    }
    return list;
  }

  removeStringFrom(value: string, list: string[]): string[] {
    const index = list.indexOf(value, 0);
    if (index > -1) {
      list.splice(index, 1);
    }
    return list;
  }

  getUserGroup(page: Page, groupId: number): Observable<PagedData<UserGroupModel>> {
    try {

      const params = {
        limit: page.size,
        page: page.pageNumber + 1,

        groupId: groupId,
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection,
        ids: page.filters.ids.join(',')
      };

      return this.http.post(`${environment.API}api/group/GetUserByGroup`, JSON.stringify(params))
        .map((res: Response) => {
          const pagedData = new PagedData<UserGroupModel>();
          page.totalElements = res.json().total;
          page.totalPages = Math.ceil(page.totalElements / page.size);
          pagedData.data = res.json().items.map((item: any) => {
            return new UserGroupModel().deserialize(item);
          });
          pagedData.page = page;
          return pagedData;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('GroupService.getUserGroup - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  setPagePrevState(key: string, page: Page): void {
    console.log('set', key, page);
    pagePrevStates[key] = page;
  }

  getPagePrevState(key: string): Page {
    console.log('get', key, pagePrevStates[key]);
    return pagePrevStates[key];
  }

  isLastPage(pagedData: PagedData<UserGroupModel>): boolean {
    return (pagedData.page.totalPages <= 1 ||
      ((pagedData.page.pageNumber + 1) === pagedData.page.totalPages));
  }

  notExistIntoList(user: UserGroupModel, list: UserGroupModel[]): boolean {
    return !this.existIntoList(user, list);
  }

  existIntoList(user: UserGroupModel, list: UserGroupModel[]): boolean {
    return list.some((selected) => user.id === selected.id);
  }

  isEmptyGroup(groupId: number): Observable<any> {
    try {
      return this.http.get(`${environment.API}api/group/isEmptyGroup?groupId=${groupId}`)
        .map((res: Response) => { return res.json(); })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('GroupService.isEmptyGroup - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  delete(groupId: number): Observable<any> {
    try {
      const group = new GroupByStateItem();
      group.groupId = groupId;
      return this.http.post(`${environment.API}api/group/DeleteGroup`, JSON.stringify(group))
        .map((res: Response) => {
          return true;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('GroupService.delete - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getGroup(id: number): Observable<GroupModel> {
    try {
      return this.http.get(`${environment.API}api/group/${id}`)
        .map((res: Response) => {
          return new GroupModel().deserialize(res.json());
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.getGroup - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  edit(group: GroupModel): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/group/EditGroup`, group)
        .map((res: Response) => {
          return new GroupModel().deserialize(res.json());
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('GroupService.edit - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  add(group: GroupModel): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/group/AddGroup`, group)
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('GroupService.add - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
