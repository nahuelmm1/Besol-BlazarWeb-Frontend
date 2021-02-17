import { ISerializable } from '../../core/serialization/iserializable';

export class ComputerSettings implements ISerializable<ComputerSettings> {
  pageSize: number = 10;

  deserialize(input: any): ComputerSettings {
    Object.assign(this, input);
    return this;
  }
}
