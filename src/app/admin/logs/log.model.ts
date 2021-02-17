import * as moment from 'moment';
import { environment } from '../../../environments/environment';

export class Log {
  appLogId: number;
  applicationName: string;
  url: string;
  message: string;
  type: string;
  stackTrace: string;
  serverTimeStamp: string;
  clientTimeStamp: string;
  userAgent: string;
  userName: string;
  clientIpAddress: string;
  jsonData: string;

  deserialize(input: any): Log {
    Object.assign(this, input);

    if (input.clientTimeStamp) {
      this.clientTimeStamp = moment(input.clientTimeStamp).format(environment.DATE_FORMAT);
    }

    if (input.serverTimeStamp) {
      this.serverTimeStamp = moment(input.serverTimeStamp).format(environment.DATE_FORMAT);
    }

    return this;
  }
}
