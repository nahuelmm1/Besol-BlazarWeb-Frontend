import { ISerializable } from '../../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';

export class CartHistoryModel implements ISerializable<CartHistoryModel> {
  cartNumber: number;
  date: string;
  stateName: string;
  user: string;
  userFullname: string;
  comment: string;

  deserialize(input: any): CartHistoryModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
