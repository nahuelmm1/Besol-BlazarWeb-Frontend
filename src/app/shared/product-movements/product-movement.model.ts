import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class ProductMovememntModel implements ISerializable<ProductMovememntModel> {
  date: string;
  description: string;
  from: number;
  to: number;
  fromName: number;
  toName: number;

  deserialize(input: any): ProductMovememntModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
