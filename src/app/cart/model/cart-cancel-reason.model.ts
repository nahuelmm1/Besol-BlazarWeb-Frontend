import { ISerializable } from '../../core/serialization/iserializable';

export class CartCancelReasonModel implements ISerializable<CartCancelReasonModel> {
  id: number;
  name: string;

  deserialize(input: any): CartCancelReasonModel {
    Object.assign(this, input);
    return this;
  }
}
