import { ISerializable } from '../../core/serialization/iserializable';

export class CartExpressModel implements ISerializable<CartExpressModel> {
  id: number;
  name: string;
  allowCashOnDelivery: boolean;

  deserialize(input: any): CartExpressModel {
    Object.assign(this, input);
    return this;
  }
}
