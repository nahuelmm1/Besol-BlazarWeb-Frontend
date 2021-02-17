import { ISerializable } from '../../../core/serialization/iserializable';

export class OperationModel implements ISerializable<OperationModel> {
  operationId: number;
  name: string;
  description: string;

  deserialize(input: any): OperationModel {
    Object.assign(this, input);
    return this;
  }
}
