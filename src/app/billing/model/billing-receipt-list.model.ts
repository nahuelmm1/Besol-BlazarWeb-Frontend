import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class BillingReceiptListItem implements ISerializable<BillingReceiptListItem> {
  date: string;
  voucherNumber: number;
  clientName: string;
  amount: number;
  pointOfSale: string;
  sellerName: string;

  deserialize(input: any): BillingReceiptListItem {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
