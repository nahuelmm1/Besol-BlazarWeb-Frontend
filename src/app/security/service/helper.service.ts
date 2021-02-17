import { Injectable, Provider } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { LoggingService } from '../../core/logging/logging.service';
import { CartExpressModel } from '../../cart/model/cart-express.model';
import { VatModel } from '../../cart/model/vat.model';
import { Province } from '../../shared/models/province.model';
import { City } from '../../shared/models/city.model';
import { SaleList } from '../../shared/models/sale-list.model';
import { Suplier } from '../../shared/models/suplier.model';


@Injectable()
export class HelperService {

  constructor(private http: Http,
    private logService: LoggingService) { }

  getExpress(): Observable<Array<CartExpressModel>> {
    try {
      return this.http.get(`${environment.API}api/helper/Express`)
                  .map((res: Response) => {
                    return res.json().map((express: CartExpressModel) =>
                      new CartExpressModel().deserialize(express));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('HelperService.getExpress - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getVAT(): Observable<Array<VatModel>> {
    try {
      return this.http.get(`${environment.API}api/helper/Vat`)
                  .map((res: Response) => {
                    return res.json().map((vat: VatModel) =>
                      new VatModel().deserialize(vat));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('HelperService.getVAT - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getProvince(): Observable<Array<Province>> {
    try {
      return this.http.get(`${environment.API}api/helper/Province`)
                  .map((res: Response) => {
                    return res.json().map((province: Province) =>
                      new Province().deserialize(province));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('HelperService.getProvince - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }


  getCity(provinceId: number): Observable<Array<City>> {
    try {
      return this.http.get(`${environment.API}api/helper/Province/${provinceId}/city`)
                  .map((res: Response) => {
                    return res.json().map((city: City) =>
                      new City().deserialize(city));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('HelperService.getCity - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getSaleList(): Observable<Array<SaleList>> {
    try {
      return this.http.get(`${environment.API}api/helper/SalePriceList`)
                  .map((res: Response) => {
                    return res.json().map((saleList: SaleList) =>
                      new SaleList().deserialize(saleList));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('HelperService.getSaleList - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  getSupliers(): Observable<Array<Suplier>> {
    try {
      return this.http.get(`${environment.API}api/helper/Supliers`)
                  .map((res: Response) => {
                    return res.json().map((suplier: Suplier) =>
                      new Suplier().deserialize(suplier));
                  })
                  .catch((err: any) => this.logService.handleHttpResponseError(err));
    } catch (error) {
      this.logService.error('HelperService.getSupliers - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

}
