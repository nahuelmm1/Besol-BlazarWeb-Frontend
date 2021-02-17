import { ISerializable } from '../../../core/serialization/iserializable';

export class OperationGroupModel implements ISerializable<OperationGroupModel> {
  operationId: number;
  groupId: number;

  deserialize(input: any): OperationGroupModel {
    Object.assign(this, input);
    return this;
  }
}
