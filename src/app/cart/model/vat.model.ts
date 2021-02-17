import { ISerializable } from '../../core/serialization/iserializable';

export class VatModel implements ISerializable<VatModel> {
  id: number;
  name: string;

  deserialize(input: any): VatModel {
    Object.assign(this, input);
    return this;
  }
}
