import { ISerializable } from '../../core/serialization/iserializable';

export class ReassignCartModel implements ISerializable<ReassignCartModel> {
  currentAssignee: string;
  possibleAssignees: Array<ReassignCartAssigneeModel>;

  deserialize(input: any): ReassignCartModel {
    Object.assign(this, input);

    if (input.possibleAssignees) {
      this.possibleAssignees = input.possibleAssignees.map((user) => new ReassignCartAssigneeModel().deserialize(user));
    }
    return this;
  }
}

export class ReassignCartAssigneeModel implements ISerializable<ReassignCartAssigneeModel> {
  fullname: string;
  userId: number;

  deserialize(input: any): ReassignCartAssigneeModel {
    Object.assign(this, input);
    return this;
  }
}
