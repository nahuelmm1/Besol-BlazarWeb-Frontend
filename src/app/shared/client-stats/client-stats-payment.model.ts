import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class ClientStatsPaymentModel implements ISerializable<ClientStatsPaymentModel> {
  cartId: string;
  paymentId: number;
  date: string;
  rejected: boolean;
  approved: boolean;
  bank: string;
  transaction: string;
  amount: string;
  subsidiary: string;

  deserialize(input: any): ClientStatsPaymentModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
