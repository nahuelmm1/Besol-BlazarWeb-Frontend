import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardV1Component} from './demo/custom-pages/dashboard-v1/dashboard-v1.component';
import {AdminComponent} from './core/admin/admin.component';
import {LoginComponent} from './login/login.component';
import { LogListComponent } from './admin/logs/log-list.component';
import { SettingsComponent } from './core/settings/settings.component';

import {
  CashRegisterListComponent,
  CashRegisterOpenComponent,
  CashRegisterCloseComponent,
  CashRegisterDetailComponent,
  CashRegisterCheckerListComponent
} from './cash-register/index';

import {
  BillingReceiptListComponent,
  BillingReceiptCreateComponent,
  BillingReceiptEditComponent,
} from './billing/index';


import {
  CartByStateComponent,
  CartDetailComponent,
  EmployeePerformanceComponent,
} from './cart/index';

import {ButtonsComponent} from './demo/components/buttons/buttons.component';
import {CardsComponent} from './demo/components/cards/cards.component';
import {DialogsComponent} from './demo/components/dialogs/dialogs.component';
import {GridListComponent} from './demo/components/grid-list/grid-list.component';
import {ListsComponent} from './demo/components/lists/lists.component';
import {MenuComponent} from './demo/components/menu/menu.component';
import {SliderComponent} from './demo/components/slider/slider.component';
import {SnackBarComponent} from './demo/components/snack-bar/snack-bar.component';
import {TooltipComponent} from './demo/components/tooltip/tooltip.component';
import {DynamicMenuComponent} from './demo/dynamic-menu/dynamic-menu.component';
import {FormElementsComponent} from './demo/forms/form-elements/form-elements.component';
import {FormWizardComponent} from './demo/forms/form-wizard/form-wizard.component';
import {IconsComponent} from './demo/icons/icons.component';
import {Level5Component} from './demo/levels/level5/level5.component';
import {GoogleMapsComponent} from './demo/maps/google-maps/google-maps.component';
import {SimpleTableComponent} from './demo/tables/simple-table/simple-table.component';
import {FixedHeaderTableComponent} from './demo/tables/fixed-header-table/fixed-header-table.component';

import {RegisterComponent} from './demo/custom-pages/register/register.component';
import {ForgotPasswordComponent} from './demo/custom-pages/forgot-password/forgot-password.component';
import {EditorComponent} from './demo/editor/editor.component';
import {DashboardComponent} from './demo/dashboard/dashboard.component';
import {DragAndDropComponent} from './demo/drag-and-drop/drag-and-drop.component';
import {InboxComponent} from './demo/apps/inbox/inbox.component';
import {CalendarComponent} from './demo/apps/calendar/calendar.component';
import {ChatComponent} from './demo/apps/chat/chat.component';
import {AutocompleteComponent} from './demo/components/autocomplete/autocomplete.component';
import {CheckoutOpenComponent} from './demo/checkout/open/open.checkout.component';

import { AuthGuard } from './shared/auth-guard.service';
import { CartByInactiveUsersComponent } from './cart/cart-by-inactive-users/cart-by-inactive-users.component';
import { OperationsComponent } from './admin/operations/operations.component';
import { SupplierCalendarComponent } from './supplier/calendar/supplier-calendar.component';
import { ParameterComponent } from './admin/parameters/parameter.component';
import { BannerComponent } from './admin/banners/banner.component';
import { NewComponent } from './admin/news/new.component';
import { InactiveUsersComponent } from './security/inactive-users/inactive-users.component';
import { UserComponent } from './security/user/user.component';
import { MovementComponent } from './stock';
import { UserPasswordComponent } from './security/user/user-password/user-password.component';
import { UserDetailComponent } from './security/user/user-detail/user-detail.component';
import { UserDebtComponent } from './security/user/user-debt/user-debt.component';
import { GroupComponent } from './security/group/group.component';
import { GroupDetailComponent } from './security/group/group-detail/group-detail.component';
import { PurchaseOrderComponent } from './purchases/purchase-order/purchase-order.component';
import { PurchaseOrderCreateComponent } from './purchases/purchase-order-create/purchase-order-create.component';
import { AssignedComponent } from './cart/cart-by-assigned/cart-by-assigned.component';
import { MinimumsComponent} from './products/minimums/minimums.component';
import { PriceListComponent } from './products/lists/price-list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: '',
    component: AdminComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'admin/logs',
        component: LogListComponent
      },
      {
        path: 'admin/operations',
        component: OperationsComponent
      },
      {
        path: 'admin/parameters',
        component: ParameterComponent
      },
      {
        path: 'admin/banners',
        component: BannerComponent
      },
      {
        path: 'admin/news',
        component: NewComponent
      },
      {
        path: 'stock',
        component: MovementComponent,
        data: {
          security: '/'
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          security: '/'
        }
      },
      {
        path: 'cashregister/list',
        component: CashRegisterListComponent
      },
      {
        path: 'cashregister/open',
        component: CashRegisterOpenComponent
      },
      {
        path: 'cashregister/close',
        component: CashRegisterCloseComponent
      },
      {
        path: 'cashregister/detail/:id',
        component: CashRegisterDetailComponent
      },
      {
         path: 'cashregister/detail',
         component: CashRegisterDetailComponent
      },
      {
         path: 'cashregister/checker/list',
         component: CashRegisterCheckerListComponent
      },
      {
        path: 'billing/receipt',
        component: BillingReceiptListComponent
      },
      {
        path: 'billing/receipt/create',
        component: BillingReceiptCreateComponent,
        data: {
          security: '/billing/receipt'
        }
      },
      {
        path: 'billing/receipt/edit/:id',
        component: BillingReceiptEditComponent,
        data: {
          security: '/billing/receipt'
        }
      },
      {
        path: 'cart/byState',
        component: CartByStateComponent
      },
      {
        path: 'cart/employeePerformance',
        component: EmployeePerformanceComponent
      },
      {
        path: 'cart/detail/:id',
        component: CartDetailComponent,
        data: {
          security: '/cart/byState',
          navigateBack: '/cart/byState'
        }
      },
      {
        path: 'assigned/detail/:id',
        component: CartDetailComponent,
        data: {
          security: '/assigned',
          navigateBack: '/assigned'
        }
      },
      {
        path: 'cart/detail-inactive/:id',
        component: CartDetailComponent,
        data: {
          security: '/cart/byInactiveUser',
          navigateBack: '/cart/byInactiveUser'
        }
      },
      {
        path: 'suppliers/calendar',
        component: SupplierCalendarComponent
      },
      {
        path: 'purchases/purchaseOrder',
        component: PurchaseOrderComponent
      },  // , navigateBack: '/purchases/purchaseOrder'
      {
        path: 'purchases/purchaseOrder/create',
        component: PurchaseOrderCreateComponent,
        data: {
          security: '/purchases/purchaseOrder'
        }
      },
      {
        path: 'cart/byInactiveUser',
        component: CartByInactiveUsersComponent
      },
      {
        path: 'security/group',
        component: GroupComponent
      },
      {
        path: 'security/group/detail',
        component: GroupDetailComponent,
        data: {
          security: '/security/group',
          navigateBack: '/security/group'
        }
      },
      {
        path: 'security/group/detail/:id',
        component: GroupDetailComponent,
        data: {
          security: '/security/group',
          navigateBack: '/security/group'
        }
      },
      {
        path: 'security/users',
        component: UserComponent
      },
      {
        path: 'security/users/password/:id',
        component: UserPasswordComponent,
        data: {
          security: '/security/users',
          navigateBack: '/security/users'
        }
      },
      {
        path: 'security/users/detail/:id',
        component: UserDetailComponent,
        data: {
          security: '/security/users',
          navigateBack: '/security/users'
        }
      },
      {
        path: 'security/users/debt/:id',
        component: UserDebtComponent,
        data: {
          security: '/security/users',
          navigateBack: '/security/users'
        }
      },
      {
        path: 'security/byInactiveUser',
        component: InactiveUsersComponent
      },
      {
        path: 'apps/inbox',
        component: InboxComponent
      },
      {
        path: 'apps/calendar',
        component: CalendarComponent
      },
      {
        path: 'apps/chat',
        component: ChatComponent
      },
      {
        path: 'dashboard-v1',
        component: DashboardV1Component,
      },
      {
        path: 'components/autocomplete',
        component: AutocompleteComponent
      },
      {
        path: 'checkout/open',
        component: CheckoutOpenComponent
      },
      {
        path: 'components/buttons',
        component: ButtonsComponent
      },
      {
        path: 'components/cards',
        component: CardsComponent
      },
      {
        path: 'components/dialogs',
        component: DialogsComponent
      },
      {
        path: 'components/grid-list',
        component: GridListComponent
      },
      {
        path: 'components/lists',
        component: ListsComponent
      },
      {
        path: 'components/menu',
        component: MenuComponent
      },
      {
        path: 'components/slider',
        component: SliderComponent
      },
      {
        path: 'components/snack-bar',
        component: SnackBarComponent
      },
      {
        path: 'components/tooltips',
        component: TooltipComponent
      },
      {
        path: 'dynamic-menu',
        component: DynamicMenuComponent
      },
      {
        path: 'forms/form-elements',
        component: FormElementsComponent
      },
      {
        path: 'forms/form-wizard',
        component: FormWizardComponent
      },
      {
        path: 'icons',
        component: IconsComponent
      },
      {
        path: 'level1/level2/level3/level4/level5',
        component: Level5Component
      },
      {
        path: 'maps/google-maps',
        component: GoogleMapsComponent
      },
      {
        path: 'tables/simple-table',
        component: SimpleTableComponent
      },
      {
        path: 'tables/fixed-header-table',
        component: FixedHeaderTableComponent
      },
      {
        path: 'drag-and-drop',
        component: DragAndDropComponent
      },
      {
        path: 'editor',
        component: EditorComponent
      },
      {
        path: 'assigned',
        component: AssignedComponent
      },
      {
        path: 'products/minimums',
        component: MinimumsComponent
      },
      {
        path: 'products/list',
        component: PriceListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class RoutingModule { }
