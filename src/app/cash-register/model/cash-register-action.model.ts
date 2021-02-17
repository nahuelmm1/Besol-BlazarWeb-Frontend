import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { PointOfSaleModel } from '../../shared/models/point-of-sale.model';

export class CashRegisterModel implements ISerializable<CashRegisterModel> {
  cashRegisterId: number;
  date: string;
  amount: number;
  cashAmount: number;
  cardAmount: number;
  checkAmount: number;
  depositAmount: number;
  description: string;
  operation: string;
  userName: string;
  pointOfSale: PointOfSaleModel;
  verified: boolean;

  deserialize(input: any): CashRegisterModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }

    if (input.pointOfSale) {
      this.pointOfSale = new PointOfSaleModel().deserialize(input.pointOfSale);
    }

    return this;
  }
}
