import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class CartHeaderModel implements ISerializable<CartHeaderModel> {
  cartNumber: number;
  deliveryCode: string;
  comment: string;
  additionalInfo: string;
  homeDelivery:boolean;
  express: string;
  isExpress: boolean;
  payWithDelivery: boolean;
  location: string;
  suggestAlternativeProduct: boolean;
  personToPickUp: string;
  pickUpDate: string;

  deserialize(input: any): CartHeaderModel {
    Object.assign(this, input);
    return this;
  }
}
