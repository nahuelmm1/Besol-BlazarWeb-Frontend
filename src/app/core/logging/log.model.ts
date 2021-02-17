import * as moment from 'moment';

export class Log {
  url: string;
  message: string;
  type: string;
  //loglevel: string;
  stackTrace: string;
  userAgent: string;
  clientTimeStamp: string;

  jsonData: string;

  constructor(url: string, message: string, type: string, stackTrace: string) {
    this.url        = url;
    this.message    = message;
    //this.loglevel   = logLevel;
    this.type       = type;
    this.stackTrace = stackTrace;

    this.clientTimeStamp = moment.utc().format();
    this.userAgent = navigator.userAgent;
  }
}
