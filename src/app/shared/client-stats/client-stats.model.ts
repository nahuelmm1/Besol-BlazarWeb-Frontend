import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class ClientStatsModel implements ISerializable<ClientStatsModel> {
  cuit: string;
  address: string;
  registerDate: string;
  iva: string;
  email: string;
  fullname: string;
  currentDebt: string;
  province: string;
  phone: string;
  lastAccess: string;
  debt: string;
  debtComment: string;
  rankingId: number;

  deserialize(input: any): ClientStatsModel {
    Object.assign(this, input);

    if (input.registerDate) {
      this.registerDate = moment(input.registerDate).format(environment.DATE_FORMAT);
    }
    if (input.lastAccess) {
      this.lastAccess = moment(input.lastAccess).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
