import { Component, OnInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { User } from '../../shared/models/user.model';
import { CartService } from '../service/cart.service';
import { UserService } from '../../security/service/user.service';
import { TranslateService } from '../../core/translate/translate.service';
import { CartDetailModel } from '../model/cart-detail.model';
import { CartHeaderModel} from '../model/cart-header.model';
import { CartDetailProductModel } from '../model/cart-detail-product.model';
import { CartDetailPaymentModel } from '../model/cart-detail-payment.model';
import { CartDetailBoxModel } from '../model/cart-detail-box.model';
import { PageLoaderService } from '../../shared/page-loader-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { CartExpressModel } from '../model/cart-express.model';
import { CartCommentModel } from '../model/cart-comment.model';
import { LocalStorageService } from '../../shared/local-storage.service';
import { CartDetailAddressModalComponent } from './cart-detail-address-modal/cart-detail-address-modal.component';
import { CartDetailOptionProductModalComponent } from './cart-detail-option-product-modal/cart-detail-option-product-modal.component';
import { CartDetailBoxModalComponent } from './cart-detail-box-modal/cart-detail-box-modal.component';
import { CartDetailCancelModalComponent } from './cart-detail-cancel-modal/cart-detail-cancel-modal.component';
import { CartDetailChangeStateModalComponent } from './cart-detail-change-state-modal/cart-detail-change-state-modal.component';
import { CartDetailMissingStockModalComponent } from './cart-detail-missing-stock-modal/cart-detail-missing-stock-modal.component';
import { CartDetailAddArticleModalComponent } from './cart-detail-add-article-modal/cart-detail-add-article-modal.component';
import { CartHistoryModalComponent } from '../shared/cart-history/cart-history-modal.component';
import { ClientStatsModalService } from '../../shared/client-stats/client-stats-modal.service';
import { ProductMovementsModalService } from '../../shared/product-movements/product-movements-modal.service';
import { PhysicalProductModalComponent } from '../shared/physical-product-modal/physical-product-modal.component';
import { CartDetailDownloadAttachedOrdersModalComponent } from './cart-detail-download-attached-orders-modal/cart-detail-download-attached-orders-modal.component';
import { Observable } from 'rxjs';

const IN_PROGRESS_STATE = 2;
const STATE_MAP = [];
export const INITIAL_STATE = 1;

// {stateId: 1, name: "Iniciado"}
STATE_MAP[1] = {
  allowAddProduct: true,
  allowRecalculatePrice: true,
  allowCancel: true,
  allowChangeState: true,
  allowAddOptionProduct: true,
};
// {stateId: 2, name: "Preparacion"}
STATE_MAP[2] = {
  allowAddProduct: true,
  allowRecalculatePrice: true,
  allowCancel: true,
  allowCashOnDelivery: true,
  allowChangeState: true,
  allowDeleteAddedProduct: true,
  allowConfirmProduct: true,
  allowAddOptionProduct: true,
};
// {stateId: 3, name: "En Control"}
STATE_MAP[3] = {
  allowAddProduct: true,
  allowRecalculatePrice: true,
  allowRequestAddition: true,
  allowCancel: true,
  allowCashOnDelivery: true,
  allowChangeState: true,
  allowDeleteAddedProduct: true,
  allowConfirmProduct: true,
  allowAddOptionProduct: true,
};
// {stateId: 4, name: "Armado"}
STATE_MAP[4] = {
  allowRequestAddition: true,
  allowCancel: true,
  allowCashOnDelivery: true,
  allowChangeState: true,
  allowExport: true,
};
// {stateId: 5, name: "Pagado"}
STATE_MAP[5] = {
  allowCancel: true,
  allowCashOnDelivery: true,
  allowChangeState: true,
  allowExport: true,
  allowChangeShippingAddress: true,
  showPaidVerification: true,
};
// {stateId: 6, name: "Despachado"}
STATE_MAP[6] = {
  allowCashOnDelivery: true,
  allowExport: true,
};
// {stateId: 7, name: "Cancelado"}
STATE_MAP[7] = {
  allowCashOnDelivery: true,
  allowChangeState: true,
  allowExport: true,
};


@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss']
})

export class CartDetailComponent implements OnInit {
  cart: CartDetailModel;
  cartComments: Array<CartCommentModel>;
  cartId: string;
  nextState: string;
  hasCart: boolean;
  isCarriedFromPointOfSale: boolean;
  cartProducts: Array<CartDetailProductModel> = [];
  isLoadingCartProducts: boolean;
  cartPayments: Array<CartDetailPaymentModel> = [];
  isLoadingCartPayments: boolean;
  user: User;
  @ViewChild('iptLocation') inputLocation: ElementRef;
  @ViewChild('iptExpress') inputExpress: ElementRef;
  @ViewChild('iptPaidCheck') inputPaidCheck: ElementRef;
  //userDetail: user
  frmCart: FormGroup;
  frmExpress: FormGroup;
  expressList: Array<any> = [];
  notAssignedExpress = new CartExpressModel().deserialize({
    id: 0,
    name: 'not assigned'
  });
  authorization = {
    allowRecalculatePrice: false,
    allowAddProduct: false,
    allowExportExcel: true,
    allowExportPdf: true,
    allowExportAttachedExcel: true,
    allowExportAttachedPdf: true,
    allowExport: true,
    allowRequestAddition: false,
    allowCancel: false,
    allowChangeShippingAddress: false,
    allowChangeState: false,
    allowCashOnDelivery: false,
    showPaidVerification: false,
    allowDeleteAddedProduct: false,
    allowConfirmProduct: false,
    allowAddOptionProduct: false,
    userAuth: null,
    isUserBuyer: false,
    isUserBuyerExpress: false,
    isCartAdmin: false
  };

  constructor(
              private cartService: CartService,
              private fb: FormBuilder,
              private pageLoaderService: PageLoaderService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute,
              public renderer: Renderer,
              private localStorageService: LocalStorageService,
              private confirmService: ConfirmDialogueService,
              private dialogRef: MdDialog,
              private auth: AuthService,
              private clientStatsModalService: ClientStatsModalService,
              private productMovementsModalService: ProductMovementsModalService,
              private userService: UserService
            ) {
  }

  ngOnInit(): void {
    this.hasCart = false;
    this.pageLoaderService.setPageLoadingStatus(true);
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.cartId = params.get('id');
        return this.cartService.getDetail(parseInt(this.cartId, 10));
      })
      .subscribe(
        (cart) => {
          this.cart = cart;
          setTimeout(() => this.hasCart = true, 0); // prevent issue ExpressionChangedAfterItHasBeenCheckedError
          this.pageLoaderService.setPageLoadingStatus(false);
          this.loadProducts();
          this.loadPayments();
          this.loadInternalComments();
          this.initAuthorization();
          this.initExpress();
          this.initForm();
          this.loadUser();
        },
        (err) => {
          this.notificationBar.error(err);
          this.pageLoaderService.setPageLoadingStatus(false);
        }
      );
  }

  loadProducts(): void {
    this.cartProducts = [];
    this.isLoadingCartProducts = true;
    this.cartService.getProducts(this.cart.cartNumber)
      .subscribe(
        (products) => {
          this.cartProducts = products.sort((a: CartDetailProductModel, b: CartDetailProductModel) => CartDetailProductModel.sortProducts(a, b));
          this.isLoadingCartProducts = false;
        },
        (err) => {
          this.isLoadingCartProducts = false;
          this.notificationBar.error(err);
        }
      );
  }

  loadPayments(): void {
    this.cartPayments = [];
    this.isLoadingCartPayments = true;
    this.cartService.getPayments(this.cart.cartNumber)
      .subscribe(
        (payments) => {
          this.cartPayments = payments;
          this.isLoadingCartPayments = false;
        },
        (err) => {
          this.isLoadingCartPayments = false;
          this.notificationBar.error(err);
        }
      );
  }

  loadInternalComments(): void {
    this.cartComments = [];
    this.cartService.getComments(this.cart.cartNumber)
      .subscribe(
        (comments) => {
          this.cartComments = comments;
        },
        (err) => {
          this.notificationBar.error(err);
        }
      );
  }

  initAuthorization(): void {
    const cart = this.cart;
    const stateConfig = STATE_MAP[cart.stateId];
    const isCartAdmin = this.localStorageService.getUserData().authorization.isCartAdmin;

    this.authorization.allowAddProduct = stateConfig.allowAddProduct;
    this.authorization.allowRecalculatePrice = stateConfig.allowRecalculatePrice;
    this.authorization.allowRequestAddition = stateConfig.allowRequestAddition;
    this.authorization.allowCancel = stateConfig.allowCancel;
    this.authorization.allowChangeShippingAddress = stateConfig.allowChangeShippingAddress && !cart.isCarriedFromPointOfSale;
    this.authorization.allowCashOnDelivery = stateConfig.allowCashOnDelivery;
    this.authorization.allowChangeState = stateConfig.allowChangeState && isCartAdmin;
    this.authorization.showPaidVerification = stateConfig.showPaidVerification;
    this.authorization.allowDeleteAddedProduct = stateConfig.allowDeleteAddedProduct;
    this.authorization.allowConfirmProduct = stateConfig.allowConfirmProduct;
    this.authorization.allowAddOptionProduct = stateConfig.allowAddOptionProduct;
    this.authorization.isUserBuyer = cart.isUserBuyer;
    this.authorization.isUserBuyerExpress = cart.isUserBuyerExpress;
    this.authorization.isCartAdmin =  isCartAdmin;
    this.authorization.userAuth = {
      allowedStates: [],
    };

    this.cartService.getNextState(cart.stateId).subscribe(
      (nextState) => {
        this.nextState = nextState && nextState.name;
      }
    );

    this.cartService.getUserAuthorization().subscribe(
      (auth) => {
        this.authorization.userAuth = auth;
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );
  }

  initForm(): void {
    const cart = this.cart || (this.cart = new CartDetailModel());

    this.isCarriedFromPointOfSale = cart.isCarriedFromPointOfSale;
    if(this.cart.expressTransportName === null || this.cart.expressTransportName ===undefined ||
      this.cart.expressTransportName === '')
      this.cart.expressTransport = this.notAssignedExpress;
    else
      this.cart.expressTransport = this.expressList.find(x => x.name === this.cart.expressTransportName);

    this.frmCart = this.fb.group({
      client: [cart.username],
      cuit: [cart.cuit],
      clientNumber: [cart.clientNumber],
      address: [cart.address],
      location: [cart.location],
      taxes: [cart.taxes],
      debt: [cart.debt],
      debtComment: [cart.debtComment],
      totalAmount: [cart.totalAmount],
      email: [cart.email],
      shippingMethod: [cart.isCarriedFromPointOfSale ? '1' : '0'],
      country: [cart.country],
      province: [cart.province],
      city: [cart.city],
      shippingAddress: [cart.shippingAddress],
      expressTransport: [cart.expressTransport || this.notAssignedExpress],
      trackNumber: [cart.trackNumber],
      cashOnDelivery: [{
        value: cart.cashOnDelivery,
        disabled: !this.authorization.allowCashOnDelivery
      }],
      deliveryOption: [cart.deliverAtDoor ? '1' : '0'],
      suggestAlternativeProducts: {value: cart.suggestAlternativeProducts ? '0' : '1', disabled: true},
      phone: [cart.phone],
      comment: [cart.comment],
      additionalData: [cart.additionalData],
      internalData: [cart.internalData],
      requestAddition: [{
        value: cart.requestAddition,
        disabled: true
      }],
      carryBy: [cart.carryBy],
      carryDate: [cart.carryDate],
      paidChecked: [cart.paidChecked],

    });

    const paidChecked = this.frmCart.get('paidChecked');
    paidChecked.valueChanges.subscribe(
      (value) => {
        this.updatePaidChecked(value);
      }
    );

    const expressTransport = this.frmCart.get('expressTransport');
    const trackNumber = this.frmCart.get('trackNumber');
    const cashOnDelivery = this.frmCart.get('cashOnDelivery');
    const deliveryOption = this.frmCart.get('deliveryOption');

    // expressTransport.valueChanges.subscribe(
    //   (value) => {
    //     const selectedExpress = value;
    //     let cashOnDelivery = this.frmCart.get('cashOnDelivery').value;

    //     const frmValues = this.frmExpress.value;
    //     frmValues.cashOnDelivery = cashOnDelivery;

    //     this.updateExpress(selectedExpress, frmValues);
    //   }
    // );

    this.frmExpress = this.fb.group({
      expressTransport,
      trackNumber,
      cashOnDelivery,
      deliveryOption
    });

    this.frmExpress.valueChanges
    .debounceTime(800)
    .subscribe(
      (values) => {
        const express = this.getSelectedExpress();
        this.updateExpress(express, values);
      }
    );    
  }

  getSelectedExpress(): any {
    const express = this.frmCart.get('expressTransport').value;
    return (express===undefined || express ===null)?null:express;
  }

  updateExpress(express, values): void {
    values.cartNumber = this.cart.cartNumber;

    if (express && express.id !== 0) {
      values.expressTransportName = express.name;
    } else {
      values.expressTransportName = null;
    }

    values.deliverAtDoor = values.deliveryOption === '1';
    this.cartService.updateExpress(values).subscribe(
      (productAmmounts) => {
        this.refreshAmounts(productAmmounts);
        this.loadPayments();
        this.notificationBar.success('cart express updated with success');
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );
  }

  updatePaidChecked(paidChecked): void {
    const dto = {
      cartNumber: this.cart.cartNumber,
      paidChecked
    };

    this.cartService.updatePaidCheck(dto).subscribe(
      (cart) => {
        this.cart.paidChecked = cart.paidChecked;
        this.loadPayments();
        this.notificationBar.success('cart paid check updated with success');
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );
  }

  initExpress(): void {
    this.cartService.getExpress()
      .subscribe((express: Array<any>) => {
        this.expressList = express;
    });
  }

  loadUser(): void {
    this.userService.getUser(this.cart.userId)
      .subscribe(user => {
        this.user = user;
          // if (this.cart.expressTransport ==  null) {
          //   if(this.cart.expressTransportName === null || this.cart.expressTransportName ===undefined ||
          //     this.cart.expressTransportName === '')
          //     this.cart.expressTransport = this.notAssignedExpress;
          //   else
          //     this.cart.expressTransport = this.expressList.find(x => x.name === user.expreso);
          //   this.frmCart.get('expressTransport').setValue(this.cart.expressTransport);
          // }
        }
    );
  }

  onGoBack() {
    this.route.data.subscribe((value) => {
      this.router.navigate([value.navigateBack]);
    });
  }

  canUpdate(): boolean {
    return this.hasCart && this.frmCart.valid;
  }

  onUpdateHeader() {
    if (this.canUpdate()) {
      this.pageLoaderService.setPageLoadingStatus(true);
      const cart = new CartHeaderModel();
      cart.additionalInfo = this.frmCart.get('additionalData').value;
      cart.cartNumber = this.cart.cartNumber;
      cart.comment = this.frmCart.get('comment').value;
      cart.deliveryCode = this.frmCart.get('trackNumber').value;
      cart.express = this.cart.expressTransportName;
      cart.isExpress = (this.frmCart.get('shippingMethod').value == 1);
      cart.homeDelivery =  (this.frmCart.get('deliveryOption').value == 1);
      cart.location = this.frmCart.get('location').value;
      cart.payWithDelivery = this.frmCart.get('cashOnDelivery').value;
      cart.personToPickUp =  this.frmCart.get('carryBy').value;
      cart.pickUpDate = this.frmCart.get('carryDate').value;
      cart.suggestAlternativeProduct =(this.frmCart.get('suggestAlternativeProducts').value == 0);
      this.cartService.updateHeader(cart).subscribe(() => {
        this.pageLoaderService.setPageLoadingStatus(false);
          this.notificationBar.success('cart updated success');
        }
      );
    } else {
      this.notificationBar.error('ErrCartCannotBeUpdated');
      this.pageLoaderService.setPageLoadingStatus(false);
    }
  }

  onChangeShippingMethod($event): void {
    const shippingMethod = $event.value;
    if (shippingMethod === '0' && !this.authorization.isUserBuyer) {
      this.notificationBar.error('ErrCartUserNotBuyer');

      // revert change
      setTimeout(() => {
        this.frmCart.get('shippingMethod').setValue('1');
        this.frmCart.get('shippingMethod').markAsPristine();
      });
      return;
    }
    if (shippingMethod === '1' && !this.authorization.isUserBuyerExpress) {
      this.notificationBar.error('ErrCartUserNotBuyerExpress');

      // revert change
      setTimeout(() => {
        this.frmCart.get('shippingMethod').setValue('0');
        this.frmCart.get('shippingMethod').markAsPristine();
      });
      return;
    }
    this.isCarriedFromPointOfSale = shippingMethod === '1';
  }

  onAddComment(comment) {
    this.pageLoaderService.setPageLoadingStatus(true);
    const newComment = new CartCommentModel();
    newComment.comment = comment;
    newComment.cartNumber = this.cart.cartNumber;
    this.cartService.addComment(newComment).subscribe(
      (addedComment) => {
        this.cartComments.push(addedComment);
        this.notificationBar.success('cart comment added with success');
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  notImplemented() {
    alert('No implementado aun');
  }

  changeShippingAddress(): void {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '30%';

    const dialogRef = this.dialogRef.open(CartDetailAddressModalComponent, config);
    dialogRef.componentInstance.cart = this.cart;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          const cart = new CartDetailModel();
          cart.cartNumber = this.cart.cartNumber;
          cart.shippingAddress = result.address;
          cart.province = result.province;
          cart.city = result.city;
          cart.country = this.cart.country || 'Argentina';

          this.cartService.updateAddress(cart).subscribe(
            (updatedAddress) => {
              this.frmCart.get('shippingAddress').setValue(updatedAddress.shippingAddress);
              this.frmCart.get('city').setValue(updatedAddress.city);
              this.frmCart.get('province').setValue(updatedAddress.province);
              this.frmCart.get('country').setValue(updatedAddress.country);
              this.notificationBar.success('cart address updated with success');
            }
          );
        }
      }
    );
  }

  onLockProduct(product: CartDetailProductModel): void {
    // this.isLoadingCartProducts = true;
    product.locked = !product.locked;
    this.cartService.updateProductLocked(product).subscribe(
      () => {
        // this.loadProducts();
      },
      (err) => {
        product.locked = !product.locked;
        this.notificationBar.error(err);
        // this.isLoadingCartProducts = false;
      }
    );
  }

  onConfirmProduct(product: CartDetailProductModel): void {
    // this.isLoadingCartProducts = true;
    product.confirmed = !product.confirmed;
    this.cartService.updateProductConfirmed(product).subscribe(
      (productAmmounts) => {
        this.refreshAmounts(productAmmounts);
        // this.loadProducts();
        this.loadPayments();
      },
      (err) => {
        product.confirmed = !product.confirmed;
        this.notificationBar.error(err);
        // this.isLoadingCartProducts = false;
      }
    );
  }

  onDeleteAddedProduct(product: CartDetailProductModel): void {
    this.isLoadingCartProducts = true;
    this.cartService.deleteAddedProduct(product).subscribe(
      (productAmmounts) => {
        this.refreshAmounts(productAmmounts);
        this.loadProducts();
        this.loadPayments();
      },
      (err) => {
        this.notificationBar.error(err);
        this.isLoadingCartProducts = false;
      }
    );
  }

  refreshAmounts(productAmmounts: CartDetailModel) {
    this.cart.totalAmount = productAmmounts.totalAmount;
    this.cart.amount = productAmmounts.amount;
    if (productAmmounts.shippingCost !== undefined) {
      this.cart.shippingCost = productAmmounts.shippingCost;
    }
    this.frmCart.get('totalAmount').setValue(this.cart.totalAmount);
  }

  onOptionCommentProduct(product: CartDetailProductModel): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.getOptionProducts(product).subscribe(
      (products) => {
        this.pageLoaderService.setPageLoadingStatus(false);
        const config = new MdDialogConfig();
        config.disableClose = true;
        config.hasBackdrop = true;
        config.width = '30%';

        const dialogRef = this.dialogRef.open(CartDetailOptionProductModalComponent, config);
        dialogRef.componentInstance.loadOptions(products);
        dialogRef.afterClosed().subscribe(
          (result) => {
            if (result.doAction) {
              this.pageLoaderService.setPageLoadingStatus(true);
              const addProducts = {
                cartNumber: this.cartId,
                products: result.products
              };
              this.cartService.addOptionProducts(addProducts).subscribe(
                (productAmmounts) => {
                  this.refreshAmounts(productAmmounts);
                  this.loadProducts();
                  this.loadPayments();
                  this.pageLoaderService.setPageLoadingStatus(false);
                },
                (err) => {
                  this.notificationBar.error(err);
                  this.pageLoaderService.setPageLoadingStatus(false);
                }
              );
            }
          }
        );
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  onPackaging(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.getBoxes(this.cart.cartNumber).subscribe(
      (boxes) => {
        this.pageLoaderService.setPageLoadingStatus(false);
        const config = new MdDialogConfig();
        config.disableClose = true;
        config.hasBackdrop = true;
        config.width = '30%';

        if (boxes.length === 0) {
          const newBox = new CartDetailBoxModel();
          boxes.push(newBox);
        }

        const dialogRef = this.dialogRef.open(CartDetailBoxModalComponent, config);
        dialogRef.componentInstance.loadBoxes(boxes);
        dialogRef.afterClosed().subscribe(
          (result) => {
            if (result.doAction) {
              this.pageLoaderService.setPageLoadingStatus(true);
              const dto = {
                cartNumber: this.cart.cartNumber,
                boxes: result.boxes
              };
              this.cartService.addBoxes(dto).subscribe(
                (productAmmounts) => {
                  this.refreshAmounts(productAmmounts);
                  this.pageLoaderService.setPageLoadingStatus(false);
                },
                (err) => {
                  this.notificationBar.error(err);
                  this.pageLoaderService.setPageLoadingStatus(false);
                }
              );
            }
          }
        );
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  onCancel(): void {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '30%';

    const dialogRef = this.dialogRef.open(CartDetailCancelModalComponent, config);
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.pageLoaderService.setPageLoadingStatus(true);
          const dto = {
            cartNumber: this.cart.cartNumber,
            reasonId: result.reasonId,
            comment: result.comment
          };
          this.cartService.cancelCart(dto).subscribe(
            (updatedCart) => {
              this.cart = updatedCart;
              this.initAuthorization();
              this.initForm();
              this.pageLoaderService.setPageLoadingStatus(false);
            },
            (err) => {
              this.notificationBar.error(err);
              this.pageLoaderService.setPageLoadingStatus(false);
            }
          );
        }
      }
    );
  }

  recalculatePrice(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.recalcCartPrice(this.cart.cartNumber).subscribe(
      (updatedCart) => {
        this.pageLoaderService.setPageLoadingStatus(false);
        this.refreshAmounts(updatedCart);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  onNextState(): void {
    if (!this.frmCart.get('location').value) {
      this.notificationBar.error('ErrCartLocationRequired');
      this.renderer.invokeElementMethod(this.inputLocation.nativeElement, 'focus', []);
      return;
    }

    if (!this.isStateAllowed()) {
      this.notificationBar.error('ErrCartStateNotAllowed');
      return;
    }

    const express = this.getSelectedExpress();
    
    if (!this.cart.isCarriedFromPointOfSale && (!express || (express.id === 0 && this.cart.stateId > IN_PROGRESS_STATE))) {
      this.notificationBar.error('ErrCartExpressMandatory');
      this.renderer.invokeElementMethod(this.inputExpress, 'focus', []);
      return;
    }  
    
    const paidChecked = this.frmCart.get('paidChecked').value;
    if (this.authorization.showPaidVerification && !paidChecked) {
      this.notificationBar.error('ErrCartPaidNotVerified');
      this.renderer.invokeElementMethod(this.inputPaidCheck, 'focus', []);
      return;
    }

    const values = this.frmCart.value;
    values.cartNumber = this.cart.cartNumber;

    if (express && express.id !== 0) {
      values.expressTransportName = express.name;
    } else {
      values.expressTransportName = null;
    }

    this.pageLoaderService.setPageLoadingStatus(true);
    
    this.cartService.updateStateForward(this.frmCart.value).subscribe(
      (response) => {
        if (response.missingStock) {
          this.onMissingStock(response.products);
        } else {
          this.cart = response.cart;
          this.initAuthorization();
          this.initForm();
          this.loadPayments();
          this.loadProducts();
        }
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  isStateAllowed(): boolean {
    return this.authorization.userAuth.allowedStates.find((state) => state.stateId === this.cart.stateId);
  }

  onMissingStock(products: CartDetailProductModel[]) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '60%';

    const dialogRef = this.dialogRef.open(CartDetailMissingStockModalComponent, config);
    dialogRef.componentInstance.products = products;
    dialogRef.componentInstance.cartNumber = this.cart.cartNumber;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.pageLoaderService.setPageLoadingStatus(true);
          const dto = {
            cartNumber: this.cart.cartNumber,
          };
          this.cartService.fixStock(dto).subscribe(
            () => {
              this.pageLoaderService.setPageLoadingStatus(false);
            },
            (err) => {
              this.notificationBar.error(err);
              this.pageLoaderService.setPageLoadingStatus(false);
            }
          );
        }
      }
    );
  }

  exportPdf(added = false): void {
    if(added){
      this.getAttachedOrdersSelectedForPrinting(this.cart).subscribe( (selectedOrders:number[]) => {
        selectedOrders.forEach( cartId =>{
          this.pageLoaderService.setPageLoadingStatus(true);
          this.cartService.downloadCartPdf(cartId, added)
          .subscribe(
            () => {
              this.pageLoaderService.setPageLoadingStatus(false);
            },
            (err) => {
              this.pageLoaderService.setPageLoadingStatus(false);
              this.notificationBar.error(err);
            });  
        })  
      });
    }
    else{
      this.pageLoaderService.setPageLoadingStatus(true);
      this.cartService.downloadCartPdf(this.cart.cartNumber, added)
        .subscribe(
          () => {
            this.pageLoaderService.setPageLoadingStatus(false);
          },
          (err) => {
            this.pageLoaderService.setPageLoadingStatus(false);
            this.notificationBar.error(err);
          });  
    }
  }

  exportXls(added = false): void {    
    if(added){
      this.getAttachedOrdersSelectedForPrinting(this.cart).subscribe( (selectedOrders:number[]) => {
        selectedOrders.forEach( cartId =>{
          this.pageLoaderService.setPageLoadingStatus(true);
          this.cartService.downloadCartXls(cartId, added)
          .subscribe(
            () => {
              this.pageLoaderService.setPageLoadingStatus(false);
            },
            (err) => {
              this.pageLoaderService.setPageLoadingStatus(false);
              this.notificationBar.error(err);
            });  
        })  
      });
    }else{
      this.pageLoaderService.setPageLoadingStatus(true);
      this.cartService.downloadCartXls(this.cart.cartNumber, added)
        .subscribe(
          () => {
            this.pageLoaderService.setPageLoadingStatus(false);
          },
          (err) => {
            this.pageLoaderService.setPageLoadingStatus(false);
            this.notificationBar.error(err);
        });
    }

  }

  getAttachedOrdersSelectedForPrinting(cart:CartDetailModel):Observable<number[]>{
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '30%';
    let selectedOrders:number[] = new Array<number>();
    const dialogRef = this.dialogRef.open(CartDetailDownloadAttachedOrdersModalComponent, config);
    dialogRef.componentInstance.cart = cart;
    return dialogRef.afterClosed().map(
      (result) => {
        if (result.doAction)
          selectedOrders = result.pendingIdsForDownloading;
        return selectedOrders
      })
  }

  onChangeState(): void {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '30%';

    const dialogRef = this.dialogRef.open(CartDetailChangeStateModalComponent, config);
    dialogRef.componentInstance.cartNumber = this.cart.cartNumber;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
            this.cart = result.cart;
            this.initAuthorization();
            this.initForm();
            this.loadPayments();
            this.loadProducts();
        }
      }
    );
  }

  onAddArticle(): void {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '80%';

    const dialogRef = this.dialogRef.open(CartDetailAddArticleModalComponent, config);
    dialogRef.componentInstance.cartNumber = this.cart.cartNumber;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.refreshAmounts(result.cart);
          this.loadProducts();
          this.loadPayments();
        }
      }
    );
  }

  onRequestAddition(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.requestAddition(this.cart.cartNumber).subscribe(
      (updatedCart) => {
        this.pageLoaderService.setPageLoadingStatus(false);
        this.cart.requestAddition = updatedCart.requestAddition;
        this.frmCart.get('requestAddition').setValue(updatedCart.requestAddition);
        if (!updatedCart.mailSent) {
          this.notificationBar.error('ErrUnsubscripted');
        } else {
          this.notificationBar.success('addition requested with success');
        }
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  onHistory(): void {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '80%';

    const dialogRef = this.dialogRef.open(CartHistoryModalComponent, config);
    dialogRef.componentInstance.cartNumber = this.cart.cartNumber;
  }

  clickUser($event): void {
    this.clientStatsModalService.show(this.cart.userId);
    $event.preventDefault();
  }

  onViewProductMovement(product: CartDetailProductModel): void {
    console.log('product', product);
    const description = `${product.brand}(${product.article}) ${product.color} ${product.size}`;
    this.pageLoaderService.setPageLoadingStatus(true);
    this.cartService.getProductsByDetails(product).subscribe(
      (productIds) => {
        const length = productIds.length;
        if (length === 0) {
          this.notificationBar.error('ErrNoPhysicalProductFound');
        } else if (length === 1) {
          this.productMovementsModalService.show(description, productIds[0]);
        } else {
          this.openPhysicalProductSelector(description, productIds);
        }
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.notificationBar.error(err);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  openPhysicalProductSelector(description: string, productIds: Array<number>): void {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;

    const dialogRef = this.dialogRef.open(PhysicalProductModalComponent, config);
    dialogRef.componentInstance.description = description;
    dialogRef.componentInstance.productIds = productIds;
  }

  onReleaseOrder(){
    const actionMessage = this.translate.instant('ok');
    const contentMessage = this.translate.instant('are you sure release order');
    this.confirmService.confirm({ contentMessage, actionMessage }).subscribe(result => {
      if (result && result.doAction) {
        this.cartService.releaseOrder(this.cart.cartNumber)
        .subscribe((res:boolean)=>{
          if(res){
            this.notificationBar.success(this.translate.instant('successful operation'));
          }
          else this.notificationBar.error(this.translate.instant('ErrUnexpected'));
        },
        error => this.notificationBar.error(this.translate.instant('ErrUnexpected')))
      }  
    });
  }
}
