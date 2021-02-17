import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../../shared/page-loader-service';
import { UserService } from '../../service/user.service';
import { MdDialog } from '@angular/material';
import { User } from '../../../shared/models/user.model';
import { OnInit, ViewChild, ElementRef, Component } from '@angular/core';
import { HelperService } from '../../service/helper.service';
import { CartExpressModel } from '../../../cart/model/cart-express.model';
import { VatModel } from '../../../cart/model/vat.model';
import { Province } from '../../../shared/models/province.model';
import { City } from '../../../shared/models/city.model';
import { TranslateService } from '../../../core/translate/translate.service';
import { SaleList } from '../../../shared/models/sale-list.model';
import { Suplier } from '../../../shared/models/suplier.model';


@Component({
  moduleId: module.id,
  templateUrl: 'user-detail.component.html',
  styleUrls: ['user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  @ViewChild('user') userInput: ElementRef;

  id: string;
  user: User = new User();
  userForm: FormGroup;
  errorMessages = new Array<string>();

  // Dropdown's
  expressList = new Array<CartExpressModel>();
  expressSelectedValue: string = '';
  expressId = new FormControl();

  saleList = new Array<SaleList>();
  saleSelectedValue: SaleList = new SaleList();
  saleId = new FormControl();

  suplierList = new Array<Suplier>();
  suplierSelectedValues = new Array<number>();
  suplierId = new FormControl();

  vatList = new Array<VatModel>();
  vatSelectedValue: string = '';
  vatId = new FormControl();

  provinceList = new Array<Province>();
  provinceSelectedValue: string = '';
  provinceId = new FormControl();
  deliveryProvinceSelectedValue: string = '';
  deliveryProvinceId = new FormControl();
  taxProvinceSelectedValue: string = '';
  taxProvinceId = new FormControl();

  cityList = new Array<City>();
  cityId = new FormControl();
  citySelectedValue: string = '';


  deliveryCityList = new Array<City>();
  deliveryCityId = new FormControl();
  deliveryCitySelectedValue: string = '';

  taxCityList = new Array<City>();
  taxCityId = new FormControl();
  taxCitySelectedValue: string = '';

  constructor(
    private userService: UserService,
    private notificationBar: NotificationBarService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogService: MdDialog,
    private pageLoaderService: PageLoaderService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.pageLoaderService.setPageLoadingStatus(true);
        this.id = params.get('id');
        return this.userService.getUser(parseInt(this.id, 10));
      })
      .subscribe(
        (user: User) => {
          this.pageLoaderService.setPageLoadingStatus(false);
          this.user = user;
          this.setForm();
          this.initExpress();
          this.initVat();
          this.initProvince();
          this.initSaleList();
          this.initSupliers();
        },
        (err) => {
          this.notificationBar.error(err);
          this.pageLoaderService.setPageLoadingStatus(false);
        }
      );

    this.userInput.nativeElement.focus();
  }

  initForm(): void {

    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required],
      dni: ['', Validators.required],
      address: ['', Validators.required],
      cuit: [this.user.cuit],
      cp: ['', Validators.required],
      howToContact: [''],
      phone: ['', Validators.required],
      fax: [''],
      isActive: [false],
      isPenalize: [false],
      businessName: [''],
      genre: ['1'],
      mobilePhone: [''],
      deliveryAddress: [''],
      taxAddress: ['']
    });

    this.expressId.valueChanges.subscribe(
      (value) => {
        this.expressSelectedValue = this.updateExpressSelected(value);
      }
    );

    this.vatId.valueChanges.subscribe(
      (value) => {
        this.vatSelectedValue = this.updateVatSelected(value);
      }
    );

    this.saleId.valueChanges.subscribe(
      (value) => {
        this.saleSelectedValue = this.updateSaleListSelected(value);
      }
    );

    this.provinceId.valueChanges.subscribe(
      (provinceId) => {
        this.provinceSelectedValue = this.updateProvinceSelected(provinceId);
        this.getCity(provinceId);
      }
    );

    this.deliveryProvinceId.valueChanges.subscribe(
      (provinceId) => {
        this.deliveryProvinceSelectedValue = this.updateProvinceSelected(provinceId);
        this.getDeliveryCity(provinceId);
      }
    );

    this.taxProvinceId.valueChanges.subscribe(
      (provinceId) => {
        this.taxProvinceSelectedValue = this.updateProvinceSelected(provinceId);
        this.getTaxCity(provinceId);
      }
    );

    this.cityId.valueChanges.subscribe(
      (value) => {
        this.citySelectedValue = this.updateCitySelected(value);
      }
    );

    this.suplierId.valueChanges.subscribe(
      (value) => {
        this.suplierSelectedValues = value;
      }
    );

    this.deliveryCityId.valueChanges.subscribe(
      (value) => {
        this.deliveryCitySelectedValue = this.updateDeliveryCitySelected(value);
      }
    );

    this.taxCityId.valueChanges.subscribe(
      (value) => {
        this.taxCitySelectedValue = this.updateTaxCitySelected(value);
      }
    );
  }

  setForm(): void {

    // Set Form Controls
    this.expressId.setValue(this.user.expreso);
    this.expressId.markAsPristine();
    this.vatId.setValue(this.user.iva);
    this.vatId.markAsPristine();

    this.userForm.patchValue({
      username: this.user.username,
      name: this.user.name,
      surname: this.user.surname,
      email: this.user.email,
      dni: this.user.dni,
      address: this.user.address,
      cuit: this.user.cuit,
      cp: this.user.cp,
      howToContact: this.user.howToContact,
      phone: this.user.phone,
      fax: this.user.fax,
      isActive: this.user.isActive,
      isPenalize: this.user.isPenalized,
      businessName: this.user.businessName,
      genre: [this.user.isWoman ? '1' : '0'],
      mobilePhone: this.user.mobilePhone,
      deliveryAddress: this.user.deliveryAddress,
      taxAddress: this.user.taxAddress
    });
  }

  initExpress() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getExpress().subscribe((expressList) => {
        this.expressList = expressList;
        this.setExpress();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  setExpress() {
    this.expressId.setValue(this.getExpressoSelectedId(this.user.expreso));
  }

  updateExpressSelected(valueId: string): string {
    const expressResult = this.expressList.find((expreso) => {
      return expreso.id.toString() === valueId.toString();
    });

    return (expressResult) ? expressResult.name : '';
  }

  getExpressoSelectedId(expresoName: string): number {
    const express = this.expressList.find((expreso) => {
      return expreso.name.toString() === expresoName;
    });

    return (express) ? express.id : 0;
  }

  initVat() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getVAT().subscribe((vatList) => {
        this.vatList = vatList;
        this.setVat();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  setVat() {
    this.vatId.setValue(this.getVatSelectedId(this.user.iva));
  }

  updateVatSelected(valueId: string): string {
    const vatResult = this.vatList.find((vat) => {
      return vat.id.toString() === valueId.toString();
    });

    return (vatResult) ? vatResult.name : '';
  }

  getVatSelectedId(vatName: string): number {
    const vat = this.vatList.find((vat) => {
      return vat.name.toString() === vatName;
    });

    return (vat) ? vat.id : 0;
  }

  initSaleList() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getSaleList().subscribe((saleList) => {
        this.saleList = saleList;
        this.setSaleList();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  setSaleList() {
    this.saleId.setValue(this.getSaleListSelectedId(this.user.saleList));
  }

  getSaleListSelectedId(saleListItem: SaleList): number {
    if (saleListItem === null) {
      return;
    }

    const salePrice = this.saleList.find((saleList) => {
      return saleList.salePriceId === saleListItem.salePriceId;
    });

    return (salePrice) ? salePrice.salePriceId : 0;
  }

  updateSaleListSelected(valueId: number): SaleList {
    const saleListResult = this.saleList.find((saleList) => {
      return saleList.salePriceId === valueId;
    });

    return (saleListResult) ? saleListResult : null;
  }

  initSupliers() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getSupliers().subscribe((suplierList) => {
        this.suplierList = suplierList;
        this.setSupliers();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  setSupliers() {
    const listOfSupliers = this.user.supliers.map((suplir: Suplier) => this.getSuplierSelectedId(suplir.suplierId));
    this.suplierId.setValue(listOfSupliers);
  }

  getSuplierSelected(suplierId: number): Suplier {
    const suplierSelected = this.suplierList.find((suplier) => {
      return suplier.suplierId === suplierId;
    });

    return (suplierSelected) ? suplierSelected : null;
  }

  getSuplierSelectedId(suplierId: number): number {
    const suplierSelected = this.suplierList.find((suplier) => {
      return suplier.suplierId === suplierId;
    });

    return (suplierSelected) ? suplierSelected.suplierId : null;
  }

  initProvince() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getProvince().subscribe((provinceList) => {
        this.provinceList = provinceList;
        this.setProvinces();
        this.initCities();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  setProvinces() {
    this.provinceId.setValue(this.getProvinceSelectedId(this.user.province));
    this.deliveryProvinceId.setValue(this.getProvinceSelectedId(this.user.deliveryProvince));
    this.taxProvinceId.setValue(this.getProvinceSelectedId(this.user.taxProvince));
  }

  getProvinceSelectedId(provinceName: string): number {
    const province = this.provinceList.find((province) => {
      return province.name.toString() === provinceName;
    });

    return (province) ? province.id : 0;
  }

  updateProvinceSelected(valueId: string): string {
    const provinceResult = this.provinceList.find((province) => {
      return province.id.toString() === valueId.toString();
    });

    return (provinceResult) ? provinceResult.name : '';
  }

  initCities() {
    // this.getCity(this.provinceId.value, this.cityId, this.user.city, this.cityList);
    this.getCity(this.provinceId.value);
    this.getDeliveryCity(this.deliveryProvinceId.value);
    this.getTaxCity(this.taxProvinceId.value);
  }

  // getCity(provinceId: number, cityControl: FormControl, userCity: string, cityList: Array<City>) {
  getCity(provinceId: number) {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getCity(provinceId).subscribe((cities) => {
        // cityList = cities;
        // this.setCities(cityControl, userCity, cityList);
        this.cityList = cities;
        this.setCities();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  // setCities(cityControl: FormControl, userCity: string, cityList: Array<City>) {
  //   this.cityId.setValue(this.getCitySelectedId(userCity, cityList));
  // }
  setCities() {
    this.cityId.setValue(this.getCitySelectedId(this.user.city));
  }

  // getCitySelectedId(cityName: string, cityList: Array<City>): number {
  getCitySelectedId(cityName: string): number {
    const city = this.cityList.find((city) => {
      return city.name.toString() === cityName;
    });

    return (city) ? city.id : 0;
  }

  updateCitySelected(valueId: string): string {
    const cityResult = this.cityList.find((city) => {
      return city.id.toString() === valueId.toString();
    });

    return (cityResult) ? cityResult.name : '';
  }

  getDeliveryCity(provinceId: number) {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getCity(provinceId).subscribe((cities) => {
        this.deliveryCityList = cities;
        this.setDeliveryCities();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  setDeliveryCities() {
    this.deliveryCityId.setValue(this.getDeliveryCitySelectedId(this.user.deliveryCity));
  }

  getDeliveryCitySelectedId(cityName: string): number {
    const city = this.deliveryCityList.find((city) => {
      return city.name.toString() === cityName;
    });

    return (city) ? city.id : 0;
  }

  updateDeliveryCitySelected(valueId: string): string {
    const cityResult = this.deliveryCityList.find((city) => {
      return city.id.toString() === valueId.toString();
    });

    return (cityResult) ? cityResult.name : '';
  }

  getTaxCity(provinceId: number) {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.helperService
      .getCity(provinceId).subscribe((cities) => {
        this.taxCityList = cities;
        this.setTaxCities();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  setTaxCities() {
    this.taxCityId.setValue(this.getTaxCitySelectedId(this.user.taxCity));
  }

  getTaxCitySelectedId(cityName: string): number {
    const city = this.taxCityList.find((city) => {
      return city.name.toString() === cityName;
    });

    return (city) ? city.id : 0;
  }

  updateTaxCitySelected(valueId: string): string {
    const cityResult = this.taxCityList.find((city) => {
      return city.id.toString() === valueId.toString();
    });

    return (cityResult) ? cityResult.name : '';
  }

  onGoBack() {
    this.route.data.subscribe((value) => {
      this.router.navigate([value.navigateBack]);
    });
  }



  onUpdate(): void {
    if (this.isValidForm()) {
      this.updateUserDetail();
    } else {
      this.notificationBar.error(this.errorMessages.join('.'));
    }
  }

  isValidForm(): boolean {
    const isValidState = this.userForm.valid;
    this.validateRequiredFields();

    return isValidState && this.errorMessages.length === 0;
  }

  validateRequiredFields(): void {
    this.errorMessages = new Array<string>();
    const userForm = this.userForm.value;

    if (!this.provinceSelectedValue) {
      this.errorMessages.push(this.translateService.instant('Province is required'));
    }

    if (!this.citySelectedValue) {
      this.errorMessages.push(this.translateService.instant('City is required'));
    }

    if (!this.vatSelectedValue) {
      this.errorMessages.push(this.translateService.instant('Iva field is required'));
    }

    if (this.vatSelectedValue !== 'Consumidor Final') {

      if (!userForm.businessName) {
        this.errorMessages.push(this.translateService.instant('Business field is required'));
      }

      if (!userForm.cuit) {
        this.errorMessages.push(this.translateService.instant('Cuit field is required'));
      }

      if (!this.taxProvinceSelectedValue) {
        this.errorMessages.push(this.translateService.instant('Tax province is required'));
      }

      if (!this.taxCitySelectedValue) {
        this.errorMessages.push(this.translateService.instant('Tax city is required'));
      }

      if (!userForm.taxAddress) {
        this.errorMessages.push(this.translateService.instant('Tax address is required'));
      }
    }
  }

  updateUserDetail() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.userService
      .edit(this.buildUser()).subscribe((user) => {
        this.user = user;
        this.setForm();
        this.setExpress();
        this.setVat();
        this.initProvince();
        this.pageLoaderService.setPageLoadingStatus(false);
        this.notificationBar.success('user details updated with success');
      },
        (error: string) => {
          this.notificationBar.error(error);
          this.pageLoaderService.setPageLoadingStatus(false);
        });
  }

  buildUser(): User {
    const userForm = this.userForm.value;

    const userValues = {
      id: parseInt(this.id, 10),
      username: userForm.username,
      name: userForm.name,
      surname: userForm.surname,
      businessName: (this.vatSelectedValue !== 'Consumidor Final') ? userForm.businessName : '',
      email: userForm.email,
      dni: userForm.dni,
      address: userForm.address,
      deliveryAddress: userForm.deliveryAddress,
      taxAddress: (this.vatSelectedValue !== 'Consumidor Final') ? userForm.taxAddress : '',
      country: 'Argentina',
      province: this.provinceSelectedValue,
      deliveryProvince: this.deliveryProvinceSelectedValue,
      taxProvince: (this.vatSelectedValue !== 'Consumidor Final') ? this.taxProvinceSelectedValue : '',
      city: this.citySelectedValue,
      deliveryCity: this.deliveryCitySelectedValue,
      taxCity: (this.vatSelectedValue !== 'Consumidor Final') ? this.taxCitySelectedValue : '',
      iva: this.vatSelectedValue,
      cuit: (this.vatSelectedValue !== 'Consumidor Final') ? userForm.cuit : '',
      cp: userForm.cp,
      howToContact: userForm.howToContact,
      expreso: this.expressSelectedValue,
      saleList : this.saleSelectedValue,
      phone: userForm.phone,
      mobilePhone: userForm.mobilePhone,
      fax: userForm.fax,
      isActive: userForm.isActive,
      isPenalized: userForm.isPenalize,
      isWoman: (userForm.genre === '1'),
      supliers: this.suplierSelectedValues.map((valueId: number) => new Suplier().deserialize(this.getSuplierSelected(valueId)))
    };

    return new User().deserialize(userValues);
  }
}
