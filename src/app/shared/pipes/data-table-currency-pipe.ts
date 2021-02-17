import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment';

export class DataTableCurrencyPipe extends CurrencyPipe {

  constructor() {
    super(environment.LOCALE);
  }

  public transform(value): any {
    return super.transform(value, environment.CURRENCY.CODE, true, environment.CURRENCY.FORMAT);
  }
}
