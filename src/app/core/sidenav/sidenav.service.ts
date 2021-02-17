import { Injectable } from '@angular/core';
import { SidenavItem } from '../sidenav-item/sidenav-item.model';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { TranslateService } from '../translate/translate.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { User } from '../../shared/models/user.model';

@Injectable()
export class SidenavService {

  private _itemsSubject: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<SidenavItem[]>([]);
  private _items: SidenavItem[] = [ ];
  items$: Observable<SidenavItem[]> = this._itemsSubject.asObservable();

  private _currentlyOpenSubject: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<SidenavItem[]>([]);
  private _currentlyOpen: SidenavItem[] = [ ];
  currentlyOpen$: Observable<SidenavItem[]> = this._currentlyOpenSubject.asObservable();

  isIconSidenav: boolean;

  constructor(private translate: TranslateService,
              private localStorageService: LocalStorageService) {
    this.buildMenu();
  }

  private buildMenu(): void {
    let menu = this;

    this.localStorageService.loggedInData$.subscribe(
      (user: User) => {
        if (user == null || (user.menu == null || user.menu.length === 0)) {
          this.clearMenu();
        } else {
          // menu.addItem('RouteTest-CanActivateChild-RoleGuard', 'donut_large', '/components/cards', 0);
          user.menu.forEach(m => {
            let menuItem = menu.addItem(this.translate.instant(m.languageKey), m.icon,  m.route, m.order);
            if(m.items && m.items.length > 0) {
              this.insertChildren(menuItem, m.items);
            }
          });
        }
      }
    );
  }

  private insertChildren(item: SidenavItem, menuItems: any): void {
    menuItems.forEach(m => {
      let childItem = this.addSubItem(item, this.translate.instant(m.languageKey), m.route, m.order);
      if(m.items && m.items.length > 0) {
        this.insertChildren(childItem, m.items);
      }
    });
  }

  private clearMenu(): void {
    this._items = [ ];
    this._itemsSubject.next(this._items);
  }

  addItem(name: string, icon: string, route: string, position: number, badge?: string, badgeColor?: string) {
    let item = new SidenavItem({
      name: name,
      icon: icon,
      route: route,
      subItems: [ ],
      position: position || 99,
      badge: badge || null,
      badgeColor: badgeColor || null
    });

    this._items.push(item);
    this._itemsSubject.next(this._items);

    return item;
  }

  addSubItem(parent: SidenavItem, name: string, route: string, position: number) {
    let item = new SidenavItem({
      name: name,
      route: route,
      parent: parent,
      subItems: [ ],
      position: position || 99
    });

    parent.subItems.push(item);
    this._itemsSubject.next(this._items);

    return item;
  }

  removeItem(item: SidenavItem) {
    let index = this._items.indexOf(item);
    if (index > -1) {
      this._items.splice(index, 1);
    }

    this._itemsSubject.next(this._items);
  }

  isOpen(item: SidenavItem) {
    return (this._currentlyOpen.indexOf(item) != -1);
  }

  toggleCurrentlyOpen(item: SidenavItem) {
    let currentlyOpen = this._currentlyOpen;

    if (this.isOpen(item)) {
      if (currentlyOpen.length > 1) {
        currentlyOpen.length = this._currentlyOpen.indexOf(item);
      } else {
        currentlyOpen = [ ];
      }
    } else {
      currentlyOpen = this.getAllParents(item);
    }

    this._currentlyOpen = currentlyOpen;
    this._currentlyOpenSubject.next(currentlyOpen);
  }

  getAllParents(item: SidenavItem, currentlyOpen: SidenavItem[] = [ ]) {
    currentlyOpen.unshift( item );

    if (item.hasParent()) {
      return this.getAllParents(item.parent, currentlyOpen);
    } else {
      return currentlyOpen;
    }
  }

  nextCurrentlyOpen(currentlyOpen: SidenavItem[]) {
    this._currentlyOpen = currentlyOpen;
    this._currentlyOpenSubject.next(currentlyOpen);
  }

  nextCurrentlyOpenByRoute(route: string) {
    let currentlyOpen = [ ];

    let item = this.findByRouteRecursive(route, this._items);

    if (item && item.hasParent()) {
      currentlyOpen = this.getAllParents(item);
    } else if (item) {
      currentlyOpen = [item];
    }

    this.nextCurrentlyOpen(currentlyOpen);
  }

  findByRouteRecursive(route: string, collection: SidenavItem[]) {
    let result = _.find(collection, { 'route': route });

    if (!result) {
      _.each(collection, (item) => {
        if (item.hasSubItems()) {
          let found = this.findByRouteRecursive(route, item.subItems);

          if (found) {
            result = found;
            return false;
          }
        }
      });
    }

    return result;
  }

  get currentlyOpen() {
    return this._currentlyOpen;
  }

}
