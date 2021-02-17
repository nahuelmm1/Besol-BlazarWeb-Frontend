import { ISerializable } from '../../core/serialization/iserializable';
import * as moment from 'moment';

export class AvailabilityModel implements ISerializable<AvailabilityModel> {
  id: number;
  start: Date;
  end: Date;

  deserialize(input: any): AvailabilityModel {
    Object.assign(this, input);
    this.start = moment(input.start).toDate();
    this.end = moment(input.end).toDate();
    return this;
  }
}
