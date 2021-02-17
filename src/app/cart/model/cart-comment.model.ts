import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class CartCommentModel implements ISerializable<CartCommentModel> {
  name: string;
  lastname: string;
  date: string;
  comment: string;
  cartNumber: number;
  
  deserialize(input: any): CartCommentModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
