import { ISerializable } from '../../core/serialization/iserializable';

export class CartBrandModel implements ISerializable<CartBrandModel> {
  brandId: number;
  name: string;

  deserialize(input: any): CartBrandModel {
    Object.assign(this, input);
    return this;
  }
}
