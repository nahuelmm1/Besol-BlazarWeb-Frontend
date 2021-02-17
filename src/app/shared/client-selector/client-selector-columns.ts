import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class ClientSelectorColumns {
  private clientNumber: any;
  private name: any;
  private lastname: any;
  private email: any;
  private province: any;

  constructor(private translate: TranslateService) {
    this.clientNumber = {
      name: this.translate.instant('client number'),
      prop: 'clientNumber',
      width: 145,
      sortable: true,
      cellClass: 'u-textRight',
      headerClass: 'u-textRight'
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

    this.email = {
      name: this.translate.instant('email'),
      prop: 'email',
      width: 250,
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

  clientNumberColumn(props?: any) {
    return Object.assign({}, this.clientNumber, props);
  }

  nameColumn(props?: any) {
    return Object.assign({}, this.name, props);
  }

  lastnameColumn(props?: any) {
    return Object.assign({}, this.lastname, props);
  }

  emailColumn(props?: any) {
    return Object.assign({}, this.email, props);
  }

  provinceColumn(props?: any) {
    return Object.assign({}, this.province, props);
  }
}
