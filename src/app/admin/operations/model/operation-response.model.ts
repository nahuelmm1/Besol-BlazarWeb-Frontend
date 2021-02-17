import { ISerializable } from '../../../core/serialization/iserializable';
import { GroupModel } from '../../../cart/model/Group.model';
import { OperationModel } from './operation.model';
import { OperationGroupModel } from './operation-group.model';

export class OperationResponseModel implements ISerializable<OperationResponseModel> {
  groups: Array<GroupModel>;
  operations: Array<OperationModel>;
  operationGroups: Array<OperationGroupModel>;

  deserialize(input: any): OperationResponseModel {
    Object.assign(this, input);
    if (input.groups) {
      this.groups = input.groups.map((group) => new GroupModel().deserialize(group));
    }
    if (input.operations) {
      this.operations = input.operations.map((operation) => new OperationModel().deserialize(operation));
    }
    if (input.operationGroups) {
      this.operationGroups = input.operationGroups.map((opperationGroup) => new GroupModel().deserialize(opperationGroup));
    }
    return this;
  }
}
