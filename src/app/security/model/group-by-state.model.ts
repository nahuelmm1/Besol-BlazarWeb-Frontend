import { ISerializable } from '../../core/serialization/iserializable';


export class GroupByStateItem implements ISerializable<GroupByStateItem> {
  groupId: number;
  name: string;
  description: string;

  deserialize(input: any): GroupByStateItem {
    Object.assign(this, input);
    return this;
  }
}
