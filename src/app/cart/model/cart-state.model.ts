import { ISerializable } from '../../core/serialization/iserializable';

export class CartStateModel implements ISerializable<CartStateModel> {
  stateId: number;
  name: string;

  deserialize(input: any): CartStateModel {
    Object.assign(this, input);
    return this;
  }
}
