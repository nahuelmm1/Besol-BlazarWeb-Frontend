import { ISerializable } from '../../core/serialization/iserializable';

export class Seller implements ISerializable<Seller> {
  id: number;
  userName: string;
  displayName: string;

  deserialize(input: any): Seller {
    Object.assign(this, input);
    return this;
  }
}