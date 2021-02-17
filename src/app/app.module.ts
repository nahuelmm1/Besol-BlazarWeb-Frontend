import { CartByStateUserStateDialogueComponent } from './cart/cart-by-state/cart-by-state-user-state-dialogue.component';
import { NewCreateOrEditDialogueComponent } from './admin/news/new-create-or-edit-dialogue.component';
import { NewService } from './admin/news/new.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { CurrencyPipe } from '@angular/common';
import { MaterialModule, MdIconRegistry, MdNativeDateModule, DateAdapter } from '@angular/material';

import { AppDateAdapter } from './core/translate/app-date-adapter';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { AdminComponent } from './core/admin/admin.component';
import { SettingsComponent } from './core/settings/settings.component';
import { LoginComponent } from './login/login.component';
import { LogListComponent } from './admin/logs/log-list.component';

import { MovementComponent} from './stock/movement.component';
import { DropDownEditorRender } from './stock/ag-component/dropdown-editor-render';

import {
  CashRegisterListComponent,
  CashRegisterOpenComponent,
  CashRegisterCloseComponent,
  CashRegisterDetailComponent,
  CashRegisterCheckerListComponent,
  CashRegisterDetailModalComponent,
  CashRegisterDescriptionModalComponent,
  CashRegisterFormComponent,
} from './cash-register';
import { CashRegisterColumns } from './cash-register/shared/cash-register-columns';
import { CashRegisterService } from './cash-register/service/cash-register.service';

import {
  BillingReceiptListComponent,
  BillingReceiptCreateComponent,
  BillingReceiptEditComponent,
  BillingReceiptFormComponent
} from './billing/index';
import { BillingService } from './billing/service/billing.service';
import { BillingColumns } from './billing/shared/billing-columns';

import {
  EmployeePerformanceComponent,
  CartByStateComponent,
  CartDetailComponent,
  CartDetailProductsComponent,
  CartDetailPaymentsComponent,
  CartDetailAddressModalComponent,
  CartDetailOptionProductModalComponent,
  CartDetailBoxModalComponent,
  CartDetailCancelModalComponent,
  CartDetailChangeStateModalComponent,
  CartDetailMissingStockModalComponent,
  CartDetailAddArticleModalComponent,
  CartHistoryModalComponent,
  CartDetailInternalDataComponent,
  PhysicalProductModalComponent,
  CartStateBreadcrumbComponent,
  CartByInactiveUsersComponent,
} from './cart';
import { CartService } from './cart/service/cart.service';
import { PerformanceService } from './cart/service/performance.service';
import { CartColumns } from './cart/shared/cart-columns';
import { CartByInactiveUsersColumns } from './cart/cart-by-inactive-users/cart-by-inactive-users-columns';

import { InactiveUsersColumns } from './security/inactive-users/inactive-users-columns';
import { InactiveUsersComponent } from './security/inactive-users/inactive-users.component';
import { UserComponent } from './security/user/user.component';

import {
  ClientSelectorModalComponent,
  ClientSelectorGridComponent,
  ClientSelectorColumns,
  ClientSelectorService,
} from './shared/client-selector';

import {
  TicketSelectorModalComponent,
  TicketSelectorGridComponent,
  TicketSelectorColumns,
  TicketSelectorService,
} from './shared/ticket-selector';

import {
  CartSelectorModalComponent,
  CartSelectorGridComponent,
  CartSelectorColumns,
  CartSelectorService,
} from './shared/cart-selector';

import {
  ProductMovementsService,
  ProductMovementsModalService,
  ProductMovementsModalComponent,
} from './shared/product-movements';

import {
  ReassignCartService,
  ReassignCartModalService,
  ReassignCartModalComponent,
} from './shared/reassign-cart';

import {
  ClientStatsModalComponent,
  ClientStatsService,
  ClientStatsModalService,
  ClientStatsPaymentsComponent,
  ClientStatsCartsComponent,
} from './shared/client-stats';

import { PointOfSaleService } from '../app/shared/point-of-sale.service';


import { SidenavComponent } from './core/sidenav/sidenav.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavItemComponent } from './core/sidenav-item/sidenav-item.component';
import { SidenavService } from './core/sidenav/sidenav.service';
import { IconSidenavDirective } from './core/sidenav/icon-sidenav.directive';
import { RoutingModule } from './app-routing.module';
import { DashboardV1Component } from './demo/custom-pages/dashboard-v1/dashboard-v1.component';
import { ButtonsComponent } from './demo/components/buttons/buttons.component';
import { HighlightModule } from './core/highlightjs/highlight.module';
import { FormElementsComponent } from './demo/forms/form-elements/form-elements.component';
import { SearchComponent } from './core/search/search.component';
import { BreadcrumbsComponent } from './core/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './core/breadcrumb/breadcrumb.service';
import { ListsComponent } from './demo/components/lists/lists.component';
import { WidgetComponent } from './core/widgets-v1/widget-v1/widget-v1.component';
import { D3ChartService } from './core/nvD3/nvD3.service';
import { nvD3 } from './core/nvD3/nvD3.component';
import { LineChartWidgetComponent } from './core/widgets-v1/line-chart-widget/line-chart-widget.component';
import { SourceOverviewWidgetComponent } from './core/widgets-v1/source-overview-widget/source-overview-widget.component';
import { SimpleTableComponent } from './demo/tables/simple-table/simple-table.component';
import { FixedHeaderTableComponent } from './demo/tables/fixed-header-table/fixed-header-table.component';
import { FormWizardComponent } from './demo/forms/form-wizard/form-wizard.component';
import { GoogleMapsComponent } from './demo/maps/google-maps/google-maps.component';
import { CardsComponent } from './demo/components/cards/cards.component';
import { DialogsComponent, DemoDialog } from './demo/components/dialogs/dialogs.component';
import { IconsComponent } from './demo/icons/icons.component';
import { GridListComponent } from './demo/components/grid-list/grid-list.component';
import { MenuComponent } from './demo/components/menu/menu.component';
import { SliderComponent } from './demo/components/slider/slider.component';
import { SnackBarComponent } from './demo/components/snack-bar/snack-bar.component';
import { TooltipComponent } from './demo/components/tooltip/tooltip.component';
import { DynamicMenuComponent } from './demo/dynamic-menu/dynamic-menu.component';
import { environment } from '../environments/environment';
import { Level5Component } from './demo/levels/level5/level5.component';
import { DynamicMenuService } from './demo/dynamic-menu/dynamic-menu.service';
import { RegisterComponent } from './demo/custom-pages/register/register.component';
import { ForgotPasswordComponent } from './demo/custom-pages/forgot-password/forgot-password.component';
import { QuillModule } from 'ngx-quill';
import { EditorComponent } from './demo/editor/editor.component';
import { QuickpanelComponent } from './core/quickpanel/quickpanel.component';
import { DashboardComponent } from './demo/dashboard/dashboard.component';
import { BarChartComponent } from './core/widgets/bar-chart/bar-chart.component';
import { LineChartComponent } from './core/widgets/line-chart/line-chart.component';
import { RecentSalesComponent } from './core/widgets/recent-sales/recent-sales.component';
import { PieChartComponent } from './core/widgets/pie-chart/pie-chart.component';
import { GoogleMapsWidgetComponent } from './core/widgets/google-maps-widget/google-maps-widget.component';
import { ActivityComponent } from './core/widgets/activity/activity.component';
import { TrafficSourcesComponent } from './core/widgets/traffic-sources/traffic-sources.component';
import { LoadingOverlayComponent } from './core/loading-overlay/loading-overlay.component';
import { SortablejsModule } from 'angular-sortablejs';
import { DragAndDropComponent } from './demo/drag-and-drop/drag-and-drop.component';
import { InboxComponent } from './demo/apps/inbox/inbox.component';
import { MailService } from './demo/apps/inbox/mail.service';
import { InboxComposeComponent } from './demo/apps/inbox/inbox-compose/inbox-compose.component';
import { CalendarModule } from 'angular-calendar';
import { CalendarComponent } from './demo/apps/calendar/calendar.component';
import { CalendarEditComponent } from './demo/apps/calendar/calendar-edit/calendar-edit.component';
import { ChatComponent } from './demo/apps/chat/chat.component';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './demo/components/autocomplete/autocomplete.component';
import { CheckoutOpenComponent } from './demo/checkout/open/open.checkout.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MediaReplayService } from './core/mediareplay/media-replay.service';

import { AuthService } from './shared/auth.service';
import { AuthGuard } from './shared/auth-guard.service';
import { LocalStorageService } from './shared/local-storage.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DndModule } from 'ngx-drag-drop';
import { LogService } from './admin/logs/log.service';
import { LogDetailDialogueComponent } from './admin/logs/log-detail-dialogue.component';

import { PageTitleFilterComponent } from './shared/page-title-filter/page-title-filter.component';

import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { httpFactory } from './core/interceptor/http.factory';

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService } from './core/translate/index';
import { PageLoaderService } from './shared/page-loader-service';
import { ConfirmDialogueComponent } from './shared/confirm-dialogue/confirm-dialogue';
import { PointOfSaleDialogueComponent } from './shared/point-of-sale-dialogue/point-of-sale-dialogue.component';
import { PillComponent } from './shared/pill/pill.component';
import { RankingComponent } from './shared/ranking/ranking.component';

import { LoggingService } from './core/logging/logging.service';
import { LoggingHttpService } from './core/logging/log-http.service';
import { ErrorLogHandler } from './core/logging/error-log.handler';
import { ConfirmDialogueService } from './shared/confirm-dialogue/confirm-dialogue-service';
import { PointOfSaleDialogueService } from './shared/point-of-sale-dialogue/point-of-sale-dialogue-service';
import { NotificationBarService } from './shared/notification-bar-service/notification-bar-service';
import { PostMessageService } from './shared/post-message.service';
import { OperationsComponent } from './admin/operations/operations.component';
import { OperationService } from './admin/operations/operation.service';
import { SupplierCalendarComponent } from './supplier/calendar/supplier-calendar.component';
import { AvailabilityEditComponent } from './supplier/calendar/availability-edit/availability-edit.component';
import { SupplierService } from './supplier/service/supplier.service';
import { RecurrentAvailabilityAddComponent } from './supplier/calendar/recurrent-availability/recurrent-availability-add.component';
import { ParameterComponent } from './admin/parameters/parameter.component';
import { ParameterService } from './admin/parameters/parameter.service';
import { BannerComponent } from './admin/banners/banner.component';
import { BannerService } from './admin/banners/banner.service';
import { BannerDeleteDialogueComponent } from './admin/banners/banner-delete-dialogue.component';
import { BannerCreateOrEditDialogueComponent } from './admin/banners/banner-create-or-edit-dialogue.component';
import { NewComponent } from './admin/news/new.component';
import { NewDeleteDialogueComponent } from './admin/news/new-delete-dialogue.component';
import { UserAdminColumns } from './security/shared/user-admin-columns';
import { UserService } from './security/service/user.service';
import { UserDialogueComponent } from './security/user/dialogue/user-dialogue.component';
import { UserPasswordComponent } from './security/user/user-password/user-password.component';
import { UserDetailComponent } from './security/user/user-detail/user-detail.component';
import { HelperService } from './security/service/helper.service';
import { UserDebtComponent } from './security/user/user-debt/user-debt.component';
import { GroupAdminColumns } from './security/shared/group-admin.columns';
import { GroupService } from './security/service/group.service';
import { GroupComponent } from './security/group/group.component';
import { MessageDialogueComponent } from './security/group/dialogue/message-dialogue.component';
import { GroupDetailComponent } from './security/group/group-detail/group-detail.component';
import { UserPickerComponent } from './security/group/dialogue/user-picker.component';
import { PurchaseOrderComponent } from './purchases/purchase-order/purchase-order.component';
import { PurchaseOrderService } from './purchases/service/purchase-order.service';
import { PurchaseOrderColumns } from './purchases/model/purchase-order-columns';
import { PurchaseOrderCreateComponent } from './purchases/purchase-order-create/purchase-order-create.component';
import { PurchaseOrderCreateColumns } from './purchases/model/purchase-order-create-columns';
import { FinishOrderDialogComponent } from './purchases/purchase-order-create/finish-order-dialog.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AssignedComponent } from './cart/cart-by-assigned/cart-by-assigned.component';
import { CartDetailDownloadAttachedOrdersModalComponent } from './cart/cart-detail/cart-detail-download-attached-orders-modal/cart-detail-download-attached-orders-modal.component';
import { MinimumsComponent } from './products/minimums/minimums.component';
import { ProductService } from './products/service/products.service';
import { KeysPipe } from './shared/pipes/keys-pipe';
import { UploadMinimumsFileModalComponent } from './products/minimums/upload-modal/upload-modal.component';
import { PriceListComponent } from './products/lists/price-list.component';

const perfectScrollbarConfig: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  swipePropagation: false
};

@NgModule({
  declarations: [
    AssignedComponent,
    AppComponent,
    SidenavComponent,
    SidenavItemComponent,
    IconSidenavDirective,
    DashboardV1Component,
    ButtonsComponent,
    FormElementsComponent,
    SearchComponent,
    BreadcrumbsComponent,
    ListsComponent,
    WidgetComponent,
    nvD3,
    LineChartWidgetComponent,
    SourceOverviewWidgetComponent,
    SimpleTableComponent,
    FixedHeaderTableComponent,
    FormWizardComponent,
    GoogleMapsComponent,
    CardsComponent,
    DialogsComponent,
    DemoDialog,
    IconsComponent,
    GridListComponent,
    MenuComponent,
    SliderComponent,
    SnackBarComponent,
    TooltipComponent,
    DynamicMenuComponent,
    Level5Component,
    AdminComponent,
    LoginComponent,
    SettingsComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    EditorComponent,
    QuickpanelComponent,
    DashboardComponent,
    BarChartComponent,
    LineChartComponent,
    RecentSalesComponent,
    PieChartComponent,
    GoogleMapsWidgetComponent,
    ActivityComponent,
    TrafficSourcesComponent,
    LoadingOverlayComponent,
    DragAndDropComponent,
    InboxComponent,
    InboxComposeComponent,
    CalendarComponent,
    CalendarEditComponent,
    ChatComponent,
    AutocompleteComponent,
    CheckoutOpenComponent,
    LogListComponent,
    OperationsComponent,
    LogDetailDialogueComponent,
    PageTitleFilterComponent,
    CashRegisterListComponent,
    CashRegisterOpenComponent,
    CashRegisterCloseComponent,
    TranslatePipe,
    ConfirmDialogueComponent,
    CartSelectorModalComponent,
    CartDetailDownloadAttachedOrdersModalComponent,
    CartDetailAddressModalComponent,
    CartDetailOptionProductModalComponent,
    CartDetailBoxModalComponent,
    PhysicalProductModalComponent,
    CartDetailCancelModalComponent,
    CartHistoryModalComponent,
    CartDetailAddArticleModalComponent,
    CartDetailChangeStateModalComponent,
    CartDetailMissingStockModalComponent,
    CartSelectorGridComponent,
    TicketSelectorModalComponent,
    TicketSelectorGridComponent,
    ClientSelectorModalComponent,
    ClientStatsModalComponent,
    ProductMovementsModalComponent,
    ReassignCartModalComponent,
    ClientSelectorGridComponent,
    PointOfSaleDialogueComponent,
    CashRegisterDetailComponent,
    CashRegisterCheckerListComponent,
    CashRegisterDetailModalComponent,
    CashRegisterDescriptionModalComponent,
    CashRegisterFormComponent,
    BillingReceiptListComponent,
    BillingReceiptCreateComponent,
    BillingReceiptEditComponent,
    BillingReceiptFormComponent,
    PillComponent,
    RankingComponent,
    CartStateBreadcrumbComponent,
    CartDetailInternalDataComponent,
    CartByStateComponent,
    UserComponent,
    GroupComponent,
    UploadMinimumsFileModalComponent,
    GroupDetailComponent,
    UserPasswordComponent,
    UserDetailComponent,
    UserDebtComponent,
    EmployeePerformanceComponent,
    CartDetailComponent,
    CartDetailProductsComponent,
    CartDetailPaymentsComponent,
    ClientStatsPaymentsComponent,
    ClientStatsCartsComponent,
    CartByInactiveUsersComponent,
    InactiveUsersComponent,
    SupplierCalendarComponent,
    AvailabilityEditComponent,
    RecurrentAvailabilityAddComponent,
    ParameterComponent,
    BannerComponent,
    BannerDeleteDialogueComponent,
    BannerCreateOrEditDialogueComponent,
    NewComponent,
    NewCreateOrEditDialogueComponent,
    NewDeleteDialogueComponent,
    UserDialogueComponent,
    UserPickerComponent,
    MessageDialogueComponent,
    CartByStateUserStateDialogueComponent,
    MovementComponent,
    DropDownEditorRender,
    PurchaseOrderCreateComponent,
    PurchaseOrderComponent,
    FinishOrderDialogComponent,
    MinimumsComponent,
    KeysPipe,
    PriceListComponent
  ],
  entryComponents: [
    DemoDialog,
    InboxComposeComponent,
    CalendarEditComponent,
    LogDetailDialogueComponent,
    ConfirmDialogueComponent,
    CartSelectorModalComponent,
    CartDetailAddressModalComponent,
    CartDetailOptionProductModalComponent,
    CartDetailBoxModalComponent,
    PhysicalProductModalComponent,
    CartDetailCancelModalComponent,
    CartHistoryModalComponent,
    CartDetailAddArticleModalComponent,
    CartDetailChangeStateModalComponent,
    CartDetailMissingStockModalComponent,
    TicketSelectorModalComponent,
    ClientSelectorModalComponent,
    ClientStatsModalComponent,
    ProductMovementsModalComponent,
    ReassignCartModalComponent,
    PointOfSaleDialogueComponent,
    CashRegisterDetailModalComponent,
    CashRegisterDescriptionModalComponent,
    BillingReceiptListComponent,
    BillingReceiptCreateComponent,
    BillingReceiptEditComponent,
    CartByStateComponent,
    UserComponent,
    GroupComponent,
    GroupDetailComponent,
    UserPasswordComponent,
    UserDetailComponent,
    UserDebtComponent,
    EmployeePerformanceComponent,
    CartDetailComponent,
    CartByInactiveUsersComponent,
    InactiveUsersComponent,
    SupplierCalendarComponent,
    AvailabilityEditComponent,
    RecurrentAvailabilityAddComponent,
    ParameterComponent,
    BannerComponent,
    BannerDeleteDialogueComponent,
    BannerCreateOrEditDialogueComponent,
    NewComponent,
    NewCreateOrEditDialogueComponent,
    NewDeleteDialogueComponent,
    UserDialogueComponent,
    UserPickerComponent,
    MessageDialogueComponent,
    CartByStateUserStateDialogueComponent,
    PurchaseOrderCreateComponent,
    PurchaseOrderComponent,
    FinishOrderDialogComponent,
    CartDetailDownloadAttachedOrdersModalComponent,
    UploadMinimumsFileModalComponent
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdNativeDateModule,
    FlexLayoutModule,
    AgGridModule.withComponents([DropDownEditorRender]),
    PerfectScrollbarModule.forRoot(perfectScrollbarConfig),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApi
    }),
    QuillModule,
    HighlightModule,
    SortablejsModule,
    CalendarModule.forRoot(),
    NgxDatatableModule,
    DndModule,
    MyDateRangePickerModule
  ],
  providers: [
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, Router, LocalStorageService]
    },
    {
      provide: ErrorHandler,
      useClass: ErrorLogHandler
    },
    SidenavService,
    MdIconRegistry,
    BreadcrumbService,
    DynamicMenuService,
    D3ChartService,
    MailService,
    MediaReplayService,
    AuthService,
    AuthGuard,
    LocalStorageService,
    PostMessageService,
    LogService,
    CashRegisterService,
    BillingService,
    CartService,
    UserService,
    GroupService,
    HelperService,
    PerformanceService,
    TRANSLATION_PROVIDERS,
    TranslateService,
    PageLoaderService,
    CurrencyPipe,
    PointOfSaleService,
    LoggingService,
    LoggingHttpService,
    {provide: DateAdapter, useClass: AppDateAdapter },
    ConfirmDialogueService,
    NotificationBarService,
    PointOfSaleDialogueService,
    CashRegisterColumns,
    BillingColumns,
    CartColumns,
    UserAdminColumns,
    GroupAdminColumns,
    CartByInactiveUsersColumns,
    InactiveUsersColumns,
    CartSelectorColumns,
    CartSelectorService,
    TicketSelectorColumns,
    TicketSelectorService,
    ClientSelectorColumns,
    ClientSelectorService,
    ClientStatsService,
    ClientStatsModalService,
    ProductMovementsService,
    ProductMovementsModalService,
    ReassignCartService,
    ReassignCartModalService,
    OperationService,
    SupplierService,
    ParameterService,
    BannerService,
    NewService,
    PurchaseOrderService,
    PurchaseOrderColumns,
    PurchaseOrderCreateColumns,
    ProductService,
    {provide: LOCALE_ID, useValue: 'es-AR'}
  ],
  exports:[
    KeysPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
