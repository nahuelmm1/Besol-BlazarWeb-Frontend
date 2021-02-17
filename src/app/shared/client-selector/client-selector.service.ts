import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { ClientSelectorModalComponent } from './client-selector-modal.component';
import { TranslateService } from '../../core/translate/translate.service';
import { Page } from '../models/page.model';
import { Observable } from 'rxjs/Observable';
import { PagedData } from '../models/page-data.model';
import { ClientSelectorModel } from './client-selector.model';
import { environment } from '../../../environments/environment';
import { Http, Response  } from '@angular/http';
import { LoggingService } from '../../core/logging/logging.service';

@Injectable()
export class ClientSelectorService {

  constructor(private dialogRef: MdDialog,
    private http: Http,
    private logService: LoggingService,
    private translate: TranslateService
  ) { }

  select({ multipleSelection = false }) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '90%';

    const dialogRef = this.dialogRef.open(ClientSelectorModalComponent, config);
    dialogRef.componentInstance.multipleSelection = multipleSelection;
    return dialogRef.afterClosed();
  }

  getClients(page: Page): Observable<PagedData<ClientSelectorModel>> {
    try {
      const params = {
        limit: page.size,
        page: page.pageNumber + 1,
        from: page.filters.from,                    // "YYYY-MM-DDT00:00:00",
        to: page.filters.to,                         // "2017-01-05T00:00:00",
        clientId: page.filters.clientNumber,
        name: page.filters.name,
        lastname: page.filters.lastname,
        email: page.filters.email,
        province: page.filters.province,
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection
      };

        return this.http.post(`${environment.API}api/client/list`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<ClientSelectorModel>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new ClientSelectorModel().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('ClientSelectorService.getClients - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }
}
