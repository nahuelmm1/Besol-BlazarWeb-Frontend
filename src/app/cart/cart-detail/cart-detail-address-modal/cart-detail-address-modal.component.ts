import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { CartDetailModel } from '../../model/cart-detail.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../service/cart.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { Province } from '../../../shared/models/province.model';

@Component({
  moduleId: module.id,
  templateUrl: 'cart-detail-address-modal.component.html'
})
export class CartDetailAddressModalComponent implements OnInit {
  @Input() cart: CartDetailModel;
  provinces: Array<Province>;
  selectedProvince: Province;
  cities: Array<any>;
  frmAddress: FormGroup;
  formReady = false;

  constructor(private dialogRef: MdDialogRef<CartDetailAddressModalComponent>,
              private fb: FormBuilder,
              private cartService: CartService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) { }

  ngOnInit() {
    this.cartService.getProvinces().subscribe(
      (list) => {
        this.provinces = list;
        this.initForm();
        this.formReady = true;
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );

  }

  initForm(): void {
    // Set Form Controls
    this.selectedProvince = this.provinces.find((province) => province.name === this.cart.province);

    this.frmAddress = this.fb.group({
      province: [this.selectedProvince, [Validators.required]],
      city: [this.cart.city, [Validators.required]],
      address: [this.cart.shippingAddress, [Validators.required]],
    });

    this.populateCities();
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    if (!this.frmAddress.valid) {
      return;
    }
    this.dialogRef.close({
      doAction: true,
      province: this.selectedProvince.name,
      city: this.frmAddress.get('city').value,
      address: this.frmAddress.get('address').value,
    });
  }

  onProvinceChange(event) {
    this.selectedProvince = event.value;
    this.populateCities();
  }

  populateCities() {
    if (!this.selectedProvince) {
      return;
    }

    this.cartService.getCities(this.selectedProvince.id).subscribe(
      (list) => {
        this.cities = list;
      },
      (err) => {
        this.notificationBar.error(err);
      }
    );
  }
}
