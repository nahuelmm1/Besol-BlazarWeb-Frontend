import { ISerializable } from '../../core/serialization/iserializable';

export class City implements ISerializable<City> {
  id: number;
  name: string;

  deserialize(input: any): City {
    Object.assign(this, input);
    return this;
  }
}
