import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class CartByInactiveUsersModel implements ISerializable<CartByInactiveUsersModel> {
  date: string;
  cartNumber: number;
  name: string;
  lastname: string;
  user: number;
  province: string;

  deserialize(input: any): CartByInactiveUsersModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
