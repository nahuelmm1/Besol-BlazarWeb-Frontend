import { Injectable } from '@angular/core';
import { ConnectionBackend, RequestOptions, Request, Response, Http, Headers, ResponseContentType, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';

import { LoggingService } from '../../core/logging/logging.service';

import { MinimumsItem } from '../model/minimums-item.model';
import { CartBrandModel } from '../../cart/model/cart-brand.model';

@Injectable()
export class ProductService {

  constructor(private http: Http,
              private logService: LoggingService) {}

  getMinumsReport(brandId: number): Observable<Array<MinimumsItem>> {
    try {
        return this.http.get(`${environment.API}api/Minimums/${brandId}`)
                 .map((res: Response) => {
                    return res.json().map((item: any) => {
                      return new MinimumsItem().deserialize(item);
                    });
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('CartService.getMinimumsReport - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }

  downloadMinimumsXlsx(brand:CartBrandModel):Observable<void>{
    const args: RequestOptionsArgs = {responseType: ResponseContentType.Blob};
    try {
      return this.http.post(
          `${environment.API}api/Minimums/export/xlsx/${brand.brandId}`,{},args)
          .map (
            (response) => {
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(response.blob());
              link.download = `Minimos_${brand.name}.xlsx`;
              link.click();
              return;
            })
          .catch(
            (err: any) => this.logService.handleHttpResponseError(err)
          );
    } catch (error) {
      this.logService.error('CartService.downloadMinimumXls - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  insertMinimums(brandId:number,minimums:Array<MinimumsItem>):Observable<Response>{
    const customReplacer = function(name,val) {
      if(name === 'minimumsByStoreName'){
        return Array.from(val.entries());
      }
      else return val;
    }

    try {
        let json = JSON.stringify(minimums,customReplacer);
        let body = {'array':json};
        return this.http.post(
          `${environment.API}api/Minimums/insertMinimums/${brandId}`,body)
          .map ((response:Response) => { return response});
    } catch (error) {
      this.logService.error('CartService.insertMinimums - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  uploadpriceListXls(file:File):Observable<Response>{
    try{
        const formData = new FormData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Accept','application/json; charset=UTF-8');
        formData.append('file',file);
        return this.http.post(
          `${environment.API}api/cart/priceList/import/xls/`,formData,options)
          .map ((response:Response) => { return response});
    } catch (error) {
      this.logService.error('ProductService.uploadPriceListXls - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  uploadpriceListPdf(file:File):Observable<Response>{
    try{
        const formData = new FormData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Accept','application/json; charset=UTF-8');
        formData.append('file',file);
        return this.http.post(
          `${environment.API}api/cart/priceList/import/pdf/`,formData,options)
          .map ((response:Response) => { return response});
    } catch (error) {
      this.logService.error('ProductService.uploadPriceListXls - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }
  }

  uploadMinimumsXlsx(brandId:number,file:File):Observable<Response>{
    try{
        const formData = new FormData();
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Accept','application/json; charset=UTF-8');
        formData.append('file',file);
        return this.http.post(
          `${environment.API}api/Minimums/import/xlsx/${brandId}`,formData,options)
          .map ((response:Response) => { return response});
    } catch (error) {
      this.logService.error('CartService.uploadMinimumsXlsx - Unexpected Error', error);
      return Observable.throw('ErrUnexpected');
    }

    
  }
}
