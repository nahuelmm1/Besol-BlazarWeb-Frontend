import { Component, OnInit, ViewChild, Input, TemplateRef } from '@angular/core';
import { TranslateService } from '../../core/translate';
import { ClientStatsCartModel } from './client-stats-cart.model';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'bla-client-stats-carts',
  templateUrl: 'client-stats-carts.component.html',
  styleUrls: [ './client-stats-carts.component.scss']
})

export class ClientStatsCartsComponent implements OnInit {
  @ViewChild('cartNumberCellTemplate') cartNumberCellTemplate: TemplateRef<any>;

  @Input() loading: boolean = false;
  @Input() carts: Array<ClientStatsCartModel> = [];

  columns: any = [];
  translateMessages =  {
    emptyMessage: this.translate.instant('no data to display'),
  };

  constructor(
    private router: Router,
    private dialogRef: MdDialogRef<ClientStatsCartsComponent>,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.columns = [
      {
        name: this.translate.instant('cart'),
        prop: 'cartNumber',
        cellTemplate: this.cartNumberCellTemplate,
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('date'),
        prop: 'registerDate',
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('state date'),
        prop: 'stateDate',
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('total'),
        prop: 'total',
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('state'),
        prop: 'stateName',
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
      {
        name: this.translate.instant('reason'),
        prop: 'reason',
        width: 100,
        sortable: false,
        cellClass: 'u-textCenter',
        headerClass: 'u-textCenter'
      },
    ];
  }

  goCart($event, cartNumber): void {
    $event.preventDefault();
    this.router.navigate(['/cart/detail', cartNumber]);
    this.dialogRef.close();
  }

}
