import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { SidenavItem } from "../sidenav-item/sidenav-item.model";
import { SidenavService } from "./sidenav.service";
import * as _ from 'lodash';
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { BreadcrumbService } from "../breadcrumb/breadcrumb.service";
import {MdSnackBar} from "@angular/material";
import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'ms-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit, OnDestroy {
  items: SidenavItem[];
  private _itemsSubscription: Subscription;
  private _routerEventsSubscription: Subscription;

  constructor(
    private sidenavService: SidenavService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private snackBar: MdSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this._itemsSubscription = this.sidenavService.items$
      .subscribe((items: SidenavItem[]) => {
        this.items = this.sortRecursive(items, 'position');
      });

    this._routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sidenavService.nextCurrentlyOpenByRoute(event.url);
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 400);
      }
    });

    this.breadcrumbService.addFriendlyNameForRoute('/', this.translate.instant('dashboard'));
    this.breadcrumbService.addFriendlyNameForRoute('/apps', this.translate.instant('apps'));
    this.breadcrumbService.addFriendlyNameForRoute('/admin', this.translate.instant('admin'));
    this.breadcrumbService.addFriendlyNameForRoute('/admin/logs', this.translate.instant('logs'));
    this.breadcrumbService.addFriendlyNameForRoute('/admin/operations', this.translate.instant('operations'));
    this.breadcrumbService.addFriendlyNameForRoute('/admin/parameters', this.translate.instant('parameters'));
    this.breadcrumbService.addFriendlyNameForRoute('/admin/banners', this.translate.instant('banners'));
    this.breadcrumbService.addFriendlyNameForRoute('/admin/news', this.translate.instant('news'));
    this.breadcrumbService.addFriendlyNameForRoute('/settings', this.translate.instant('settings'));
    this.breadcrumbService.addFriendlyNameForRoute('/cashregister' , this.translate.instant('cashregister'));
    this.breadcrumbService.addFriendlyNameForRoute('/cashregister/list', this.translate.instant('cash register report'));
    this.breadcrumbService.addFriendlyNameForRoute('/cashregister/open', this.translate.instant('open cash register'));
    this.breadcrumbService.addFriendlyNameForRoute('/cashregister/close', this.translate.instant('close cash register'));
    this.breadcrumbService.addFriendlyNameForRoute('/cashregister/detail', this.translate.instant('cash register state'));
    this.breadcrumbService.addFriendlyNameForRoute('/cashregister/checker', this.translate.instant('checker'));
    this.breadcrumbService.addFriendlyNameForRoute('/cashregister/checker/list', this.translate.instant('cash register checker report'));
    this.breadcrumbService.addFriendlyNameForRoute('/billing' , this.translate.instant('billing'));
    this.breadcrumbService.addFriendlyNameForRoute('/billing/receipt' , this.translate.instant('receipt'));
    this.breadcrumbService.addFriendlyNameForRoute('/billing/receipt/create' , this.translate.instant('create receipt'));
    this.breadcrumbService.addFriendlyNameForRoute('/billing/receipt/edit' , this.translate.instant('edit receipt'));
    this.breadcrumbService.addFriendlyNameForRoute('/cart' , this.translate.instant('cart'));
    this.breadcrumbService.addFriendlyNameForRoute('/cart/byState' , this.translate.instant('by state'));
    this.breadcrumbService.addFriendlyNameForRoute('/cart/employeePerformance' , this.translate.instant('employee performance'));
    this.breadcrumbService.addFriendlyNameForRoute('/cart/detail' , this.translate.instant('detail'));
    this.breadcrumbService.addFriendlyNameForRoute('/cart/byInactiveUser' , this.translate.instant('by inactive users'));
    this.breadcrumbService.addFriendlyNameForRoute('/suppliers' , this.translate.instant('suppliers'));
    this.breadcrumbService.addFriendlyNameForRoute('/suppliers/calendar' , this.translate.instant('calendar'));
    this.breadcrumbService.addFriendlyNameForRoute('/purchases' , this.translate.instant('purchases'));
    this.breadcrumbService.addFriendlyNameForRoute('/purchases/purchaseOrder' , this.translate.instant('purchase order'));
    this.breadcrumbService.addCallbackForRouteRegex('/purchases/purchaseOrder/create?.*', () => this.translate.instant('new order') )
    this.breadcrumbService.addFriendlyNameForRoute('/assigned' , this.translate.instant('assigned'));
    this.breadcrumbService.addFriendlyNameForRoute('/assigned/detail' , this.translate.instant('detail'));
    this.breadcrumbService.addFriendlyNameForRoute('/products' , this.translate.instant('products'));
    this.breadcrumbService.addFriendlyNameForRoute('/products/minimums' , this.translate.instant('minimums'));
    this.breadcrumbService.addFriendlyNameForRoute('/products/list' , "Listados de precios");
  }

  toggleIconSidenav() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);

    this.sidenavService.isIconSidenav = !this.sidenavService.isIconSidenav;

    if (this.sidenavService.isIconSidenav) {
      this.snackBar.open('You activated Icon-Sidenav, move your mouse to the content and see what happens!', '', {
        duration: 10000
      });
    }
  }

  isIconSidenav(): boolean {
    return this.sidenavService.isIconSidenav;
  }

  sortRecursive(array: SidenavItem[], propertyName: string) {
    let that = this;

    array.forEach(function (item) {
      let keys = _.keys(item);
      keys.forEach(function(key){
        if(_.isArray(item[key])){
          item[key] = that.sortRecursive(item[key], propertyName);
        }
      });
    });

    return _.sortBy(array, propertyName);
  };

  ngOnDestroy() {
    this._itemsSubscription.unsubscribe();
    this._routerEventsSubscription.unsubscribe();
  }
}
