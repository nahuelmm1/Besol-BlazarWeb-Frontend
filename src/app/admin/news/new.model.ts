import { ISerializable } from '../../core/serialization/iserializable';
import { SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class NewModel implements ISerializable<NewModel> {
  newId: number;
  image: string;
  title: string;
  text: string;
  date: string;
  file: string;
  fileType: string;
  fileImage: SafeResourceUrl;

  deserialize(input: any): NewModel {
    Object.assign(this, input);
    if (input.date) {
      this.date = moment(input.date).format(environment.DATE_FORMAT);
    }
    return this;
  }
}
