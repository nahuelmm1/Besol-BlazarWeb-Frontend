import { ISerializable } from '../../core/serialization/iserializable';

export class Suplier implements ISerializable<Suplier> {
  suplierId: number;
  name: string;

  deserialize(input: any): Suplier {
    Object.assign(this, input);
    return this;
  }
}
