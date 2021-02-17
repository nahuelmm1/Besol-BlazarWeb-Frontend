import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { CartByStateItem } from '../model/cart-by-state.model';
import { PagedData } from '../../shared/models/page-data.model';
import { Page } from '../../shared/models/page.model';

import { LoggingService } from '../../core/logging/logging.service';
import { CartStateModel } from '../model/cart-state.model';
import { CartCancelReasonModel } from '../model/cart-cancel-reason.model';
import { CartBrandModel } from '../model/cart-brand.model';
import { CartHistoryModel } from '../shared/cart-history/cart-history.model';

import { CartDetailModel } from '../model/cart-detail.model';
import { CartDetailProductModel } from '../model/cart-detail-product.model';
import { CartDetailPaymentModel } from '../model/cart-detail-payment.model';
import { CartDetailBoxModel } from '../model/cart-detail-box.model';
import { CartExpressModel } from '../model/cart-express.model';
import { CartCommentModel } from '../model/cart-comment.model';
import { CartDetailAuthModel } from '../model/cart-detail-auth.model';
import { CartDetailStateUpdateModel } from '../model/cart-detail-state-update.model';
import { Province } from '../../shared/models/province.model';
import { City } from '../../shared/models/city.model';
import { CartDetailArticleModel } from '../model/cart-detail-article.model';
import { CartDetailArticleDataModel } from '../model/cart-detail-article-data.model';
import { CartByInactiveUsersModel } from '../model/cart-by-inactive-users.model';
import { CartHeaderModel } from '../model/cart-header.model';
import { CartByAssignedItem } from '../model/cart-by-assigned.model';

let cartStates: Array<CartStateModel>;
let cartCancelReasons: Array<CartCancelReasonModel>;
let cartExpress: Array<any>;
let userAuth: CartDetailAuthModel;
const pagePrevStates: any = {};

@Injectable()
export class CartService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getCartReport(page: Page): Observable<PagedData<CartByStateItem>> {
    try {
      const NUMBERS_ONLY_PATTERN = /^[0-9]*$/;
      let cartNumber = null;
      let filter = '';

      if (NUMBERS_ONLY_PATTERN.test(page.filters.filter)) {
        cartNumber = parseInt(page.filters.filter, 10);
      } else {
        filter = page.filters.filter;
      }

      const params = {
        limit: page.size,
        page: page.pageNumber + 1,

        stateId: page.filters.stateId,
        userState: page.filters.userState,
        noTrackNumber: page.filters.noTrackNumber,
        cartNumber,
        text: filter || '',
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection
      };

        return this.http.post(`${environment.API}api/cart/bystate`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CartByStateItem>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new CartByStateItem().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CartService.getReceiptReport - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  getCartReportByAssigned(page: Page): Observable<PagedData<CartByAssignedItem>> {
    try {
      const NUMBERS_ONLY_PATTERN = /^[0-9]*$/;
      let cartNumber = null;
      let filter = '';

      if (NUMBERS_ONLY_PATTERN.test(page.filters.filter)) {
        cartNumber = parseInt(page.filters.filter, 10);
      } else {
        filter = page.filters.filter;
      }

      const params = {
        limit: page.size,
        page: page.pageNumber + 1,
        userState: page.filters.userState,
        noTrackNumber: page.filters.noTrackNumber,
        text: filter || '',
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection
      };

        return this.http.post(`${environment.API}api/cart/byAssigned`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CartByAssignedItem>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new CartByAssignedItem().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CartService.getCartReportByAssigned - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  getStates(): Observable<Array<CartStateModel>> {
    try {
      if (cartStates) {
        return Observable.of(cartStates);
      }

      return this.http.get(`${environment.API}api/cart/state`)
                  .map((res: Response) => {
                    cartStates = res.json().map((pos: any) => new CartStateModel().deserialize(pos));
                    return cartStates;
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getStates - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getDetail(id: number): Observable<CartDetailModel> {
    try {
        return this.http.get(`${environment.API}api/cart/detail/${id}`)
        .switchMap((res: Response) => {
          const cart = new CartDetailModel();
          cart.deserialize(res.json());
          if (cart.expressTransportName) {
            return this.getExpress()
              .map((expressList: Array<CartExpressModel>) => {
                const selectedExpress = expressList.filter((express) => express.name === cart.expressTransportName);
                cart.expressTransport = selectedExpress;
                return cart;
              });
          } else {
            return Observable.of(cart);
          }
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getDetail - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getExpress(): Observable<Array<CartExpressModel>> {
    try {
      if (cartExpress) {
        return Observable.of(cartExpress);
      }

      return this.http.get(`${environment.API}api/cart/express`)
                  .map((res: Response) => {
                    cartExpress = res.json().map((pos: any) => new CartExpressModel().deserialize(pos));
                    return cartExpress;
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getExpress - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getComments(cartId): Observable<Array<CartCommentModel>> {
    try {
      return this.http.get(`${environment.API}api/cart/comment/${cartId}`)
                  .map((res: Response) => {
                    return res.json().map((comment: any) => new CartCommentModel().deserialize(comment));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getComments - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  addComment(comment: CartCommentModel): Observable<CartCommentModel> {
    try {
      return this.http.post(`${environment.API}api/cart/comment`, JSON.stringify(comment))
        .map((res: Response) => {
          return new CartCommentModel().deserialize(res.json());
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.addComment - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getNextState(stateId: number): Observable<CartStateModel> {
    try {
      const nextStateId = stateId + 1;
      return this.getStates().map((states) => states.find((state) => state.stateId === nextStateId));
    } catch (error) {
      this.logService.error('CartService.getStates - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getProvinces(): Observable<Array<Province>> {
    try {
      return this.http.get(`${environment.API}api/cart/province`)
                  .map((res: Response) => {
                    return res.json().map((item: any) => new Province().deserialize(item));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getProvinces - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCities(provinceId): Observable<Array<City>> {
    try {
      return this.http.get(`${environment.API}api/cart/province/${provinceId}/cities`)
                  .map((res: Response) => {
                    return res.json().map((item: any) => new City().deserialize(item));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getCities - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateHeader(cart: CartHeaderModel): Observable<any> {
    try {
      return this.http.post(`${environment.API}api/cart/updateHeader`, JSON.stringify(cart))
        .map((res: Response) => {
          return true;
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateHeader- Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateAddress(cart: CartDetailModel): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/address`, JSON.stringify(cart))
        .map((res: Response) => {
          return new CartDetailModel().deserialize(res.json());
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateAddress - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getProducts(cartId): Observable<Array<CartDetailProductModel>> {
    try {
      return this.http.get(`${environment.API}api/cart/product/${cartId}`)
                  .map((res: Response) => {
                    return res.json().map((product: any) => new CartDetailProductModel().deserialize(product));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getProducts - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateProductConfirmed(cartProduct: CartDetailProductModel): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/product/confirm`, JSON.stringify(cartProduct))
        .map((res: Response) => {
          return new CartDetailModel().deserialize(res.json());
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateProductConfirmed - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateProductLocked(cartProduct: CartDetailProductModel): Observable<CartDetailProductModel> {
    try {
      return this.http.post(`${environment.API}api/cart/product/lock`, JSON.stringify(cartProduct))
        .map((res: Response) => {
          return new CartDetailProductModel().deserialize(res.json());
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateProductLocked - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  deleteAddedProduct(cartProduct: CartDetailProductModel): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/product/remove`, JSON.stringify(cartProduct))
        .map((res: Response) => {
          return new CartDetailModel().deserialize(res.json());
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.deleteAddedProduct - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getOptionProducts(cartProduct: CartDetailProductModel): Observable<Array<CartDetailProductModel>> {
    try {
      return this.http.post(`${environment.API}api/cart/product/option`, JSON.stringify(cartProduct))
                  .map((res: Response) => {
                    return res.json().map((product: any) => new CartDetailProductModel().deserialize(product));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getOptionProducts - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  addOptionProducts(addProducts: any): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/product/option/add`, JSON.stringify(addProducts))
                  .map((res: Response) => {
                    return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.addOptionProducts - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getPayments(cartId): Observable<Array<CartDetailPaymentModel>> {
    try {
      return this.http.get(`${environment.API}api/cart/payment/${cartId}`)
                  .map((res: Response) => {
                    return res.json().map((payment: any) => new CartDetailPaymentModel().deserialize(payment));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getPayments - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getBoxes(cartId): Observable<Array<CartDetailBoxModel>> {
    try {
      return this.http.get(`${environment.API}api/cart/box/${cartId}`)
                  .map((res: Response) => {
                    return res.json().map((payment: any) => new CartDetailBoxModel().deserialize(payment));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getBoxes - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  addBoxes(boxes: any): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/box`, JSON.stringify(boxes))
                  .map((res: Response) => {
                    return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.addBoxes - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCancelReasons(): Observable<Array<CartCancelReasonModel>> {
    try {
      if (cartCancelReasons) {
        return Observable.of(cartCancelReasons);
      }

      return this.http.get(`${environment.API}api/cart/cancel/reasons`)
                  .map((res: Response) => {
                    cartCancelReasons = res.json().map((pos: any) => new CartCancelReasonModel().deserialize(pos));
                    return cartCancelReasons;
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getCancelReasons - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  cancelCart(cancelation: any): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/cancel`, JSON.stringify(cancelation))
                  .map((res: Response) => {
                    return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.cancelCart - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  recalcCartPrice(cartId: number): Observable<CartDetailModel> {
    try {
      return this.http.get(`${environment.API}api/cart/price/recalc/${cartId}`)
                  .map((res: Response) => {
                    return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.recalcCartPrice - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateExpress(cart: any): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/express`, JSON.stringify(cart))
                  .map((res: Response) => {
                    return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateExpress - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  releaseOrder(cartId: number): Observable<boolean>  {
    try {
      return this.http.post(`${environment.API}api/cart/releaseOrder/${cartId}`,{})
                  .map(() => {
                    return Observable.of(true);
                  })
                  .catch((err: any) => {
                      this.logService.handleHttpResponseError(err);
                      return Observable.of(false);
                    });
    } catch (error) {
      this.logService.error('CartService.releaseOrder - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  requestOrder(): Observable<CartDetailModel>  {
    try {
      return this.http.get(`${environment.API}api/cart/requestOrder`)
                  .map((res:Response) => {
                    if(res.json() == null) return new CartDetailModel();
                    else
                      return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => {
                      this.logService.handleHttpResponseError(err);
                      return Observable.throw('ErrUnexpected');
                    });
    } catch (error) {
      this.logService.error('CartService.requestOrder - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getAttachedCartsId(cartId:Number): Observable<Number[]>  {
    try {
      return this.http.get(`${environment.API}api/cart/getAnexos/${cartId}`)
                  .map((res:Response) => {
                      return res.json();
                  })
                  .catch((err: any) => {
                      this.logService.handleHttpResponseError(err);
                      return Observable.throw('ErrUnexpected');
                    });
    } catch (error) {
      this.logService.error('CartService.getAttachedCartsId - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  startOrderPreparation(cartId: number): Observable<boolean>  {
    try {
      return this.http.post(`${environment.API}api/cart/startPreparation/${cartId}`,{})
                  .map(() => {
                    return Observable.of(true);
                  })
                  .catch((err: any) => {
                      this.logService.handleHttpResponseError(err);
                      return Observable.of(false);
                    });
    } catch (error) {
      this.logService.error('CartService.releaseOrder - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getUserAuthorization(): Observable<CartDetailAuthModel> {
    try {
      if (!userAuth) {
        return this.http.get(`${environment.API}api/cart/user/auth`)
          .map((res: Response) => {
            const auth = new CartDetailAuthModel();
            auth.deserialize(res.json());
            userAuth = auth;
            return auth;
        })
        .catch((err: any) => this.logService.handleHttpResponseError(err));
      } else {
        return Observable.of(userAuth);
      }
    } catch (error) {
      this.logService.error('CartService.getUserAuthorization - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateStateForward(cart: any): Observable<CartDetailStateUpdateModel> {
    try {
      return this.http.post(`${environment.API}api/cart/state/forward`, JSON.stringify(cart))
                  .switchMap((res: Response) => {
                    const response = new CartDetailStateUpdateModel();
                    response.deserialize(res.json());
                    if (response.cart && response.cart.expressTransportName) {
                      return this.getExpress()
                        .map((expressList: Array<CartExpressModel>) => {
                          const selectedExpress = expressList.filter((express) => express.name === response.cart.expressTransportName);
                          response.cart.expressTransport = selectedExpress;
                          return response;
                        });
                    } else {
                      return Observable.of(response);
                    }
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateStateForward - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  fixStock(cart: any): Observable<CartDetailStateUpdateModel> {
    try {
      return this.http.post(`${environment.API}api/cart/stock/fix`, JSON.stringify(cart))
                  .map((res: Response) => {
                    const response = new CartDetailStateUpdateModel();
                    response.deserialize(res.json());
                    if (response.cart && response.cart.expressTransportName) {
                      return this.getExpress()
                        .map((expressList: Array<CartExpressModel>) => {
                          const selectedExpress = expressList.filter((express) => express.name === response.cart.expressTransportName);
                          response.cart.expressTransport = selectedExpress;
                          return response;
                        });
                    } else {
                      return Observable.of(response);
                    }
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateStateForward - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  downloadMissingStock(cartNumber: number): Observable<number> {
    const args: RequestOptionsArgs = {
      responseType: ResponseContentType.Blob
    };
    try {
      return this.http.post(
          `${environment.API}api/cart/stock/export/missing`,
          JSON.stringify({ cartNumber }),
          args)
          .map (
            (response) => {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(response.blob());
              link.download = `Faltante_${cartNumber}.pdf`;
              link.click();
              return 1;
            })
          .catch(
            (err: any) => this.logService.handleHttpResponseError(err)
          );
    } catch (error) {
      this.logService.error('CartService.downloadMissingStock - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  setPagePrevState(key: string, page: Page): void {
    console.log('set', key, page);
    pagePrevStates[key] = page;
  }

  getPagePrevState(key: string): Page {
    console.log('get', key, pagePrevStates[key]);
    return pagePrevStates[key];
  }

  downloadCartPdf(cartNumber: number, isAdded = false): Observable<number> {
    const args: RequestOptionsArgs = {
      responseType: ResponseContentType.Blob
    };
    const addedUrl = isAdded ? '/added' : '';
    const addedFileName = isAdded ? 'Agregado' : '';
    try {
      return this.http.post(
          `${environment.API}api/cart/export${addedUrl}/pdf`,
          JSON.stringify({ cartNumber }),
          args)
          .map (
            (response) => {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(response.blob());
              link.download = `Pedido${addedFileName}_${cartNumber}.pdf`;
              link.click();
              return 1;
            })
          .catch(
            (err: any) => this.logService.handleHttpResponseError(err)
          );
    } catch (error) {
      this.logService.error('CartService.downloadCartPdf - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  downloadCartXls(cartNumber: number, isAdded = false): Observable<number> {
    const args: RequestOptionsArgs = {
      responseType: ResponseContentType.Blob
    };
    const addedUrl = isAdded ? '/added' : '';
    const addedFileName = isAdded ? 'Agregado' : '';
    try {
      return this.http.post(
          `${environment.API}api/cart/export${addedUrl}/xls`,
          JSON.stringify({ cartNumber }),
          args)
          .map (
            (response) => {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(response.blob());
              link.download = `Pedido${addedFileName}_${cartNumber}.xls`;
              link.click();
              return 1;
            })
          .catch(
            (err: any) => this.logService.handleHttpResponseError(err)
          );
    } catch (error) {
      this.logService.error('CartService.downloadCartXls - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updateState(cartStateChange: any): Observable<CartDetailStateUpdateModel> {
    try {
      return this.http.post(`${environment.API}api/cart/state/change`, JSON.stringify(cartStateChange))
                  .switchMap((res: Response) => {
                    const response = new CartDetailStateUpdateModel();
                    response.deserialize(res.json());
                    if (response.cart && response.cart.expressTransportName) {
                      return this.getExpress()
                        .map((expressList: Array<CartExpressModel>) => {
                          const selectedExpress = expressList.filter((express) => express.name === response.cart.expressTransportName);
                          response.cart.expressTransport = selectedExpress;
                          return response;
                        });
                    } else {
                      return Observable.of(response);
                    }
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updateState - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getBrands(): Observable<Array<CartBrandModel>> {
    try {
      return this.http.get(`${environment.API}api/cart/brand`)
                  .map((res: Response) => {
                    return res.json().map((brand: any) => new CartBrandModel().deserialize(brand));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getBrands - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getArticles(page: Page): Observable<PagedData<CartDetailArticleModel>> {
    try {
      const params = {
        limit: page.size,
        page: page.pageNumber + 1,

        brandId: page.filters.brandId,
        cartNumber: page.filters.cartNumber,
        filter: page.filters.filter || '',
        sortType: '',
        sortDirection: ''
      };

        return this.http.post(`${environment.API}api/cart/article`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CartDetailArticleModel>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new CartDetailArticleModel().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CartService.getArticles - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  getArticleDetails(productDefinitionId: number): Observable<CartDetailArticleDataModel> {
    try {
      return this.http.get(`${environment.API}api/cart/article/${productDefinitionId}`)
        .map((res: Response) => {
          const detail = new CartDetailArticleDataModel();
          detail.deserialize(res.json());
          return detail;
      })
      .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getArticleDetails - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  addArticle(article: any): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/product`, JSON.stringify(article))
                  .map((res: Response) => {
                    return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.addArticle - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  updatePaidCheck(cart: any): Observable<CartDetailModel> {
    try {
      return this.http.post(`${environment.API}api/cart/payment`, JSON.stringify(cart))
                  .map((res: Response) => {
                    return new CartDetailModel().deserialize(res.json());
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.updatePaidCheck - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  requestAddition(cartId: number): Observable<any> {
    try {
      return this.http.get(`${environment.API}api/cart/request/addition/${cartId}`)
                  .map((res: Response) => {
                    return res.json();
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.requestAddition - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getHistory(cartId): Observable<Array<CartHistoryModel>> {
    try {
      return this.http.get(`${environment.API}api/cart/history/${cartId}`)
                  .map((res: Response) => {
                    return res.json().map((product: any) => new CartHistoryModel().deserialize(product));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getHistory - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getProductsByDetails(cartProduct: CartDetailProductModel): Observable<Array<number>> {
    try {
      return this.http.post(`${environment.API}api/cart/product/byDetail`, JSON.stringify(cartProduct))
                  .map((res: Response) => {
                    return res.json();
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.getProductsByDetails - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  claimPayment(cartNumber: any): Observable<Array<number>> {
    try {
      return this.http.get(`${environment.API}api/cart/payment/claim/${cartNumber}`)
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.claimPayment - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getCartByInactiveUsers(page: Page): Observable<PagedData<CartByInactiveUsersModel>> {
    try {
      const params = {
        limit: page.size,
        page: page.pageNumber + 1,

        filter: page.filters.filter,
        from: page.filters.dateFrom,
        to: page.filters.dateTo,

        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection
      };

        return this.http.post(`${environment.API}api/cart/byInactiveUsers`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<CartByInactiveUsersModel>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new CartByInactiveUsersModel().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CartService.getCartByInactiveUsers - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  addGroupUserbyCart(cart: any): Observable<boolean> {
    try {
      return this.http.post(`${environment.API}api/cart/add/user`, JSON.stringify(cart))
        .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('CartService.addGroupUserbyCart - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }
}
