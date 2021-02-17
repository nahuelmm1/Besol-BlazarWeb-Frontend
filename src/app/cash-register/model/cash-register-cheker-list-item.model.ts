import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class CashRegisterCheckerListItem implements ISerializable<CashRegisterCheckerListItem> {
  pointOfSaleName: string;
  openingCashRegisterId: number;
  openingOperationDesc: string;
  openingUserName: string;
  openingDate: string;
  openingAmount: number;
  closureCashRegisterId: number;
  closureOperationDesc: string;
  closureUserName: string;
  closureDate: string;
  closureAmount: number;

  deserialize(input: any): CashRegisterCheckerListItem {
    Object.assign(this, input);

    if (input.openingDate) {
      this.openingDate = moment(input.openingDate).format(environment.DATE_FORMAT);
    }

     if (input.closureDate) {
      this.closureDate = moment(input.closureDate).format(environment.DATE_FORMAT);
    }

    return this;
  }
}
