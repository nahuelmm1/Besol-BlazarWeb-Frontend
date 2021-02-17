import { NativeDateAdapter } from '@angular/material';

// Note: Fix de bug del DatePicker para fechas en formato dd/mm/yyyy
// (falla en mostrar la fecha seleccionada al reabrir el picker (TOMA mm/dd/yyyy y no se ajusta al LOCALE))
// << Si se cambia el config setting de LOCALE hay que ajustar esta implementacion salvo que haya salido fix de MD en futura version >>
export class AppDateAdapter extends NativeDateAdapter {

  parse(value: any): Date | null {

    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}
