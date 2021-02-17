import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';


export class UserByStateItem implements ISerializable<UserByStateItem> {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  province: string;
  isActive: boolean;
  isBuyer: boolean;
  isBuyerExpress: boolean;
  isPenalized: boolean;
  isCatalogGroupAssigned: boolean;
  registerDate: string;
  lastAccessDate: string;
  ranking: number;


  deserialize(input: any): UserByStateItem {
    Object.assign(this, input);

    if (input.registerDate) {
      this.registerDate = moment(input.registerDate).format(environment.SHORT_DATE_FORMAT);
    }
    if (input.lastAccessDate) {
      this.lastAccessDate = moment(input.lastAccessDate).format(environment.SHORT_DATE_FORMAT);
    }

    return this;
  }
}
