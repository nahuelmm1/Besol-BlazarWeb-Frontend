import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class UserAdminColumns {
  private username: any;
  private email: any;
  private name: any;
  private surname: any;
  private province: any;
  private registerDate: any;
  private lastAccessDate: any;

  constructor(private translate: TranslateService) {
    this.username = {
      name: this.translate.instant('user'),
      prop: 'username',
      width: 220,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };
    this.email = {
      name: this.translate.instant('email'),
      prop: 'email',
      width: 220,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };

    this.name = {
      name: this.translate.instant('name'),
      prop: 'name',
      width: 200,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };

    this.surname = {
      name: this.translate.instant('surname'),
      prop: 'surname',
      width: 200,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };

    this.province = {
      name: this.translate.instant('province'),
      prop: 'province',
      width: 150,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };

    this.registerDate = {
      name: this.translate.instant('registering date|short'),
      prop: 'registerDate',
      width: 110,
      sortable: false,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };

    this.lastAccessDate = {
      name: this.translate.instant('last access|short'),
      prop: 'lastAccessDate',
      width: 110,
      sortable: false,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };
  }

  userNameColumn(props?: any) {
    return Object.assign({}, this.username, props);
  }
  
  mailColumn(props?: any) {
    return Object.assign({}, this.email, props);
  }

  nameColumn(props?: any) {
    return Object.assign({}, this.name, props);
  }

  surnameColumn(props?: any) {
    return Object.assign({}, this.surname, props);
  }

  provinceColumn(props?: any) {
    return Object.assign({}, this.province, props);
  }

  registerDateColumn(props?: any) {
    return Object.assign({}, this.registerDate, props);
  }

  lastAccessDateColumn(props?: any) {
    return Object.assign({}, this.lastAccessDate, props);
  }
}
