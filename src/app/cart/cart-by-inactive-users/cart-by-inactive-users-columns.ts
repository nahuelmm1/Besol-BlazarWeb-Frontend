import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class CartByInactiveUsersColumns {
  private cartNumber: any;
  private date: any;
  private name: any;
  private lastname: any;
  private user: any;
  private province: any;

  constructor(private translate: TranslateService) {
    this.cartNumber = {
      name: this.translate.instant('voucher number'),
      prop: 'cartNumber',
      width: 145,
      sortable: true,
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };

    this.date = {
      name: this.translate.instant('date'),
      prop: 'date',
      width: 175,
      sortable: true
    };

    this.name = {
      name: this.translate.instant('name'),
      prop: 'name',
      width: 250,
      sortable: true
    };

    this.lastname = {
      name: this.translate.instant('lastname'),
      prop: 'lastname',
      width: 250,
      sortable: true
    };

    this.user = {
      name: this.translate.instant('user'),
      prop: 'user',
      width: 145,
      sortable: true,
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
    };

    this.province = {
      name: this.translate.instant('province'),
      prop: 'province',
      width: 210,
      sortable: true
    };
  }

  cartNumberColumn(props?: any) {
    return Object.assign({}, this.cartNumber, props);
  }

  dateColumn(props?: any) {
    return Object.assign({}, this.date, props);
  }

  nameColumn(props?: any) {
    return Object.assign({}, this.name, props);
  }

  lastnameColumn(props?: any) {
    return Object.assign({}, this.lastname, props);
  }

  userColumn(props?: any) {
    return Object.assign({}, this.user, props);
  }

  provinceColumn(props?: any) {
    return Object.assign({}, this.province, props);
  }
}
