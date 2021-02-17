import { ISerializable } from '../../core/serialization/iserializable';

export class CartDetailBoxModel implements ISerializable<CartDetailBoxModel> {
  cartNumber: number;
  weight: number = 0;

  deserialize(input: any): CartDetailBoxModel {
    Object.assign(this, input);

    return this;
  }
}
