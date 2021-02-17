import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { LoggingService } from './logging.service';

@Injectable()
export class ErrorLogHandler extends ErrorHandler {

  constructor(private injector: Injector) {
    super(true);
  }

  handleError(error: any): void {
    let logService = <LoggingService>this.injector.get(LoggingService);

    setTimeout(() => {
        logService.error('Unhandled Error', error.originalError || error);
    });

    super.handleError(error);
  }
}
