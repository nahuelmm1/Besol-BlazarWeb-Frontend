import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class CashRegisterListItem implements ISerializable<CashRegisterListItem> {
  operation: string;
  date: string;
  voucherNumber: number;
  userName: string;
  dispatched: boolean;
  amount: number;
  amountInland: number;
  amountExpress: number;
  checked: boolean = false;
  checkedByUserName: string;
  checkedDate: string;

  deserialize(input: any): CashRegisterListItem {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }

    if (input.checkedDate) {
      this.checkedDate = moment(input.checkedDate).format(environment.DATE_FORMAT);
    }
    return this;
  }

  isClosing(): boolean {
    return this.operation === 'Cerrar Caja';
  }

  isOpening(): boolean {
    return this.operation === 'Abrir Caja';
  }

  isTotal(): boolean {
    return this.operation === 'Totales';
  }
}
