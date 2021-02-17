import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class ReceiptModel implements ISerializable<ReceiptModel> {
  date: string;
  description: string;
  receiptNumber: number;
  amount: number;
  cashAmount: number;
  cardAmount: number;
  checkAmount: number;
  depositAmount: number;
  clientId: number;
  clientName: string;
  ticketId: number;
  cartId: number;
  pointOfSaleId: number;
  pointOfSaleName: string;

  deserialize(input: any): ReceiptModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
