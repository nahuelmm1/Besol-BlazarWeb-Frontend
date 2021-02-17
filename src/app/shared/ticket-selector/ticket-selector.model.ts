import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class TicketSelectorModel implements ISerializable<TicketSelectorModel> {
  date: string;
  ticketNumber: number;
  name: string;
  lastname: string;
  user: number;
  pointOfSale: string;
  amount: number;

  deserialize(input: any): TicketSelectorModel {
    Object.assign(this, input);

    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
