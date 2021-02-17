import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { PagedData } from '../../shared/models/page-data.model';
import { Page } from '../../shared/models/page.model';
import { LoggingService } from '../../core/logging/logging.service';
import { UserByStateItem } from '../model/user-by-state.model';
import { User } from '../../shared/models/user.model';
import { Seller } from '../../shared/models/seller.model';


const pagePrevStates: any = {};

@Injectable()
export class UserService {

  private regexPassword: string = '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$';

  constructor(private http: Http,
    private logService: LoggingService) { }

  isNotEquals(sourceValue: string, targetValue: string) {
    return !this.isEquals(sourceValue, targetValue);
  }

  isEquals(sourceValue: string, targetValue: string) {
    return (sourceValue === targetValue);
  }

  isNotValidPassword(password: string) {
    return !this.isValidPassword(password);
  }

  isValidPassword(password: string) {
    return password.match(this.getPasswordPattern());
  }

  getPasswordPattern() {
    return this.regexPassword;
  }

  getUser(id: number): Observable<User> {
    try {
      return this.http.get(`${environment.API}api/user/${id}`)
        .map((res: Response) => {
          return new User().deserialize(res.json());
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.getUserBy - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  edit(user: User): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/user/EditUser`, user)
        .map((res: Response) => {
          return new User().deserialize(res.json());
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.edit - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getUserReport(page: Page): Observable<PagedData<UserByStateItem>> {
    try {

      const params = {
        limit: page.size,
        page: page.pageNumber + 1,

        userActive: page.filters.userActive,
        userState: page.filters.userState,
        text: page.filters.filter || '',
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection,
        groupId: page.filters.catalogGroupId
      };

      return this.http.post(`${environment.API}api/user/bystate`, JSON.stringify(params))
        .map((res: Response) => {
          const pagedData = new PagedData<UserByStateItem>();
          page.totalElements = res.json().total;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = res.json().items.map((item: any) => {
            return new UserByStateItem().deserialize(item);
          });
          pagedData.page = page;
          return pagedData;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.getUserReport - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getUserByGroup(page: Page): Observable<PagedData<UserByStateItem>> {
    try {

      const params = {
        limit: page.size,
        page: page.pageNumber + 1,
        text: page.filters.filter || '',
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection,
        groupId: page.filters.groupId
      };

      return this.http.post(`${environment.API}api/user/byusergroup`, JSON.stringify(params))
        .map((res: Response) => {
          const pagedData = new PagedData<UserByStateItem>();
          page.totalElements = res.json().total;
          page.totalPages = page.totalElements / page.size;
          pagedData.data = res.json().items.map((item: any) => {
            return new UserByStateItem().deserialize(item);
          });
          pagedData.page = page;
          return pagedData;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.getUserByGroup - Unexpected Error', error);
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

  updateState(user: UserByStateItem): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/user/updateState`, JSON.stringify(user))
        .map((res: Response) => {
          return true;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.updateState - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateBuyerState(user: UserByStateItem): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/user/updateBuyerState`, JSON.stringify(user))
        .map((res: Response) => {
          return true;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.updateBuyerState - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateBuyerExpressState(user: UserByStateItem): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/user/updateBuyerExpressState`, JSON.stringify(user))
        .map((res: Response) => {
          return true;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.updateBuyerExpressState - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  onUpdateGroupCatalogState(user: UserByStateItem): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/user/updateGroupCatalogState`, JSON.stringify(user))
        .map((res: Response) => {
          return true;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.updateGroupCatalogState - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updatePassword(user: User): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/user/EditPassword`, JSON.stringify(user))
        .map((res: Response) => {
          return true;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.updatePassword - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getSellers(): Observable<Array<Seller>> {
    try {
      return this.http.get(`${environment.API}api/user/GetSellers`)
        .map((res: Response) => {
          return res.json().map((seller: Seller) =>
            new Seller().deserialize(seller));
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('UserService.getSellers - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
