import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class ClientStatsCartModel implements ISerializable<ClientStatsCartModel> {
  cartNumber: number;
  registerDate: string;
  stateDate: string;
  total: string;
  stateName: string;
  reason: string;

  deserialize(input: any): ClientStatsCartModel {
    Object.assign(this, input);

    if (input.registerDate) {
      this.registerDate = moment(input.registerDate).format(environment.DATE_FORMAT);
    }
    if (input.stateDate) {
      this.stateDate = moment(input.stateDate).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
