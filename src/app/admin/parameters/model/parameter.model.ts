import { ISerializable } from '../../../core/serialization/iserializable';

export class ParameterModel implements ISerializable<ParameterModel> {
  appSettingId: number;
  key: string;
  value: string;
  description: string;

  deserialize(input: any): ParameterModel {
    Object.assign(this, input);
    return this;
  }
}
