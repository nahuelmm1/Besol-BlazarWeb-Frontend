import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class CartDetailModel implements ISerializable<CartDetailModel> {
  cartNumber: number;
  username: string;
  userId: number;
  cuit: string;
  clientNumber: number;
  address: string;
  location: string;
  taxes: string;
  debt: string;
  debtComment: string;
  amount: number;
  shippingCost: number;
  totalAmount: number;
  email: string;
  isCarriedFromPointOfSale: boolean;
  country: string;
  province: string;
  city: string;
  shippingAddress: string;
  expressTransportName: string;
  expressTransport: any;
  trackNumber: string;
  cashOnDelivery: boolean;
  suggestAlternativeProducts: boolean;
  phone: string;
  comment: string;
  additionalData: string;
  internalData: string;
  stateId: number;
  requestAddition: boolean;
  deliverAtDoor: boolean;
  carryBy: string;
  carryDate: string;
  paidChecked: boolean;
  isUserBuyer: boolean;
  isUserBuyerExpress: boolean;

  deserialize(input: any): CartDetailModel {
    Object.assign(this, input);

    if (input.carryDate) {
      this.carryDate = moment(input.carryDate).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
