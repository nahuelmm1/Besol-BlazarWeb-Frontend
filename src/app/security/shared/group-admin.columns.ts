import { Injectable } from '@angular/core';
import { TranslateService } from '../../core/translate/translate.service';

@Injectable()
export class GroupAdminColumns {
  private name: any;
  private description: any;

  constructor(private translate: TranslateService) {

    this.name = {
      name: this.translate.instant('name'),
      prop: 'name',
      width: 400,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };

    this.description = {
      name: this.translate.instant('description'),
      prop: 'description',
      width: 900,
      sortable: true,
      cellClass: 'Cell--strechSidePadding',
      headerClass: 'Cell--strechSidePadding'
    };
  }

  nameColumn(props?: any) {
    return Object.assign({}, this.name, props);
  }

  descriptionColumn(props?: any) {
    return Object.assign({}, this.description, props);
  }
}
