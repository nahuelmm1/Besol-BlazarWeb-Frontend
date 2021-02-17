import { ISerializable } from '../../core/serialization/iserializable';

export class CartDetailPaymentModel implements ISerializable<CartDetailPaymentModel> {
  cartNumber: number;

  deserialize(input: any): CartDetailPaymentModel {
    Object.assign(this, input);

    return this;
  }
}
