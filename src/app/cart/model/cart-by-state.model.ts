import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

const CASH_ON_DELIVERY_PAYMENT_ID = 2;
const PAID_PAYMENT_ID = 1;
export class CartByStateItem implements ISerializable<CartByStateItem> {
  cartNumber: string;
  registerDate: string;
  stateDate: string;
  adjustedDate: string;
  totalAmount: number;
  location: string;
  username: string;
  paymentStateId: number;
  hasCartAttached: boolean;
  hasBasket: boolean;
  rankingId: number;
  assigneeName: string;
  priority: number;
  isWorking: boolean;
  isCarriedFromPointOfSale: boolean;
  isPaid: boolean;
  isCashOnDelivery: boolean;


  deserialize(input: any): CartByStateItem {
    Object.assign(this, input);

    this.isPaid = this.paymentStateId === PAID_PAYMENT_ID;
    this.isCashOnDelivery = this.paymentStateId === CASH_ON_DELIVERY_PAYMENT_ID;

    if (input.registerDate) {
      this.registerDate = moment(input.registerDate).format(environment.SHORT_DATE_FORMAT);
    }
    if (input.stateDate) {
      this.stateDate = moment(input.stateDate).format(environment.SHORT_DATE_FORMAT);
    }
    if (input.adjustedDate) {
      this.adjustedDate = moment(input.adjustedDate).format(environment.SHORT_DATE_FORMAT);
    }
    return this;
  }
}
