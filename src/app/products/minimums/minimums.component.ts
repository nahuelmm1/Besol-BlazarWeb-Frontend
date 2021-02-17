import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TranslateService } from '../../core/translate/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { MdDialogConfig, MdDialog } from '@angular/material';
import { CartService } from '../../cart/service/cart.service';
import { CartBrandModel } from '../../cart/model/cart-brand.model';
import { ProductService } from '../service/products.service';
import { MinimumsItem } from '../model/minimums-item.model';
import { UploadMinimumsFileModalComponent } from './upload-modal/upload-modal.component';

@Component({
  moduleId: module.id,
  templateUrl: 'minimums.component.html',
  styleUrls: ['./minimums.component.scss']
})
export class MinimumsComponent implements OnInit {

  readonly MITRE_STORE:string = 'mitre';
  readonly SARMIENTO_STORE:string = 'sarmiento';
  readonly ESQUINA_STORE:string = 'esquina';
  
  isLoading: boolean = false;
  rows = new Array<MinimumsItem>(); 
  brands: CartBrandModel[] = [];
  brandId = new FormControl();
  isSelectedBrand:boolean=false

  constructor(
              private cartService: CartService,
              private notificationBar: NotificationBarService,
              private router: Router,
              private dialogRef: MdDialog,
              private route: ActivatedRoute,
              private confirmService: ConfirmDialogueService,
              private translate: TranslateService,
              private productsService:ProductService
            ) {}

  ngOnInit(): void {
    this.initBrands();
  }

  initBrands(): void {
    this.isLoading = true;
    this.cartService.getBrands()
      .subscribe(
        (brands: Array<CartBrandModel>) => {
          this.brands = brands;
          this.isLoading = false;
        },
        (err) => {
          this.notificationBar.error(err);
          this.isLoading = false;
        }
      );
  }

  onSelectedBrand(): void {
    this.isLoading = true;
    this.isSelectedBrand = true;
    this.productsService.getMinumsReport(this.brandId.value)
    .finally(()=>{this.isLoading=false})
    .subscribe(
      (res:MinimumsItem[])=>{
        this.rows = res;
      },(err)=>{
        this.notificationBar.error(this.translate.instant('ErrUnexpected'))
      });
  }

  getMinimum(storeName:string,item:MinimumsItem):number{
    return item.minimumsByStoreName.get(storeName);
  }

  setMinimum(storeName:string,item:MinimumsItem,value:string){
    try{
      if(value.trim()===''){
        item.minimumsByStoreName.set(storeName,null);
      }
      else
        item.minimumsByStoreName.set(storeName,Number(value));
    }catch(error){

    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {    
        event.preventDefault();
    }
  }
  cancel():void{
    this.onSelectedBrand();
  }

  exportXlsx(): void {
    this.isLoading=true;
    let brand: CartBrandModel = this.brands.filter(x => x.brandId == this.brandId.value)[0];
    this.productsService.downloadMinimumsXlsx(brand)
    .subscribe(
      () => {
        this.isLoading=false;      
      },
      (err) => {
        this.isLoading=false;
        this.notificationBar.error(this.translate.instant('ErrUnexpected'));
      });  
  }
  
  saveChanges(): void {
    this.isLoading = true;
    if(!this.isFreeFromEmptyValues()){
      this.isLoading = false;
      this.notificationBar.warning("No completaste todos los valores");
      return;
    }
    this.productsService.insertMinimums(this.brandId.value,this.rows)
    .subscribe(
      (res) => {
        this.isLoading = false;
        this.notificationBar.success(this.translate.instant('successful operation'));
      },
      (err) => {
        this.isLoading = false;
        if(typeof(err)==="string")
          this.notificationBar.error(err);          
        else
          this.notificationBar.error(err.json());
      });  
  }
  
  isFreeFromEmptyValues():boolean{
    try{
      this.rows.forEach((r)=>{
        r.minimumsByStoreName.forEach((value: number, key: string)=>{
          if(value === null)
            throw "error";
        });
      });
    }catch(error){
      return false;
    }
    return true;
  }

  importFile(){
    let brand: CartBrandModel = this.brands.filter(x => x.brandId == this.brandId.value)[0];
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '30%';
    const dialogRef = this.dialogRef.open(UploadMinimumsFileModalComponent, config);
    dialogRef.componentInstance.brand = brand;
    return dialogRef.afterClosed().subscribe(
      (result) => {
        if(result.doAction){
          this.isLoading = true;
          this.productsService.uploadMinimumsXlsx(brand.brandId,result.file).subscribe(
            (res) => {
              this.isLoading = false;
              this.notificationBar.success(this.translate.instant('successful operation'));
              this.onSelectedBrand();
            },
            (err) => {
              this.isLoading = false;
              if(typeof(err)==="string")
                this.notificationBar.error(err);          
              else
                this.notificationBar.error(err.json());
            });  
        }
      }
    );
  }
}
