import { ISerializable } from '../../core/serialization/iserializable';
import { CartDetailModel } from './cart-detail.model';
import { CartDetailProductModel } from './cart-detail-product.model';

export class CartDetailStateUpdateModel implements ISerializable<CartDetailStateUpdateModel> {
  cart: CartDetailModel;
  missingStock: boolean;
  products: CartDetailProductModel[];

  deserialize(input: any): CartDetailStateUpdateModel {
    Object.assign(this, input);

    if (input.cart) {
      this.cart = new CartDetailModel().deserialize(input.cart);
    }

    if (input.products) {
      this.products = input.products.map(prod => new CartDetailProductModel().deserialize(prod));
    }
    return this;
  }
}
