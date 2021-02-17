import { ISerializable } from '../../core/serialization/iserializable';

export class Province implements ISerializable<Province> {
  id: number;
  name: string;

  deserialize(input: any): Province {
    Object.assign(this, input);
    return this;
  }
}
