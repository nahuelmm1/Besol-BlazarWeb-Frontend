import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class PurchaseOrderItem implements ISerializable<PurchaseOrderItem> {
  nroOC: string;
  date: string;
  brand: string;
  store: string;
  read: number;
  delivered: boolean;
  requestedProducts: number;
  receivedProducts: number;
  totalAmount: number;

  deserialize(input: any): PurchaseOrderItem {
    Object.assign(this, input);
    if (input.date) {
      this.date = moment(input.date).format(environment.SHORT_DATE_FORMAT);
    }
    return this;
  }
}
