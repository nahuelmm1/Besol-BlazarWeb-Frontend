import { ISerializable } from '../../core/serialization/iserializable';
import { Seller } from '../../shared/models/seller.model';
import { UserGroupModel } from './user-group.model';

export class GroupModel implements ISerializable<GroupModel> {
  groupId: number;
  name: string;
  description: string;
  sellers: Array<Seller> = new Array<Seller>();
  userGroups: Array<UserGroupModel> = new Array<UserGroupModel>();

  deserialize(input: any): GroupModel {
    Object.assign(this, input);

    if (input.sellers) {
      this.sellers = this.sellers.map((seller: Seller) => new Seller().deserialize(seller));
    }

    if (input.userGroups) {
      this.userGroups = this.userGroups.map((userGroup: UserGroupModel) => new UserGroupModel().deserialize(userGroup));
    }

    return this;
  }
}
