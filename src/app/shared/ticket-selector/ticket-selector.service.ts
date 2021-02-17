import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { TicketSelectorModalComponent } from './ticket-selector-modal.component';
import { TranslateService } from '../../core/translate/translate.service';
import { Page } from '../models/page.model';
import { Observable } from 'rxjs/Observable';
import { PagedData } from '../models/page-data.model';
import { TicketSelectorModel } from './ticket-selector.model';
import { environment } from '../../../environments/environment';
import { Http, Response  } from '@angular/http';
import { LoggingService } from '../../core/logging/logging.service';

@Injectable()
export class TicketSelectorService {

  constructor(private dialogRef: MdDialog,
    private http: Http,
    private logService: LoggingService,
    private translate: TranslateService
  ) { }

  select({ multipleSelection = false, filter = {} }: any) {
    const config = new MdDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = true;
    config.width = '90%';

    const dialogRef = this.dialogRef.open(TicketSelectorModalComponent, config);
    dialogRef.componentInstance.multipleSelection = multipleSelection;
    dialogRef.componentInstance.filter = filter;
    return dialogRef.afterClosed();
  }

  getTickets(page: Page): Observable<PagedData<TicketSelectorModel>> {
    try {
      const params = {
        limit: page.size,
        page: page.pageNumber + 1,
        from: page.filters.from,                    // "YYYY-MM-DDT00:00:00",
        to: page.filters.to,                         // "2017-01-05T00:00:00",
        ticketId: page.filters.ticketNumber,
        name: page.filters.name,
        lastname: page.filters.lastname,
        user: page.filters.user,
        pointOfSaleId: page.filters.pointOfSaleId,
        amountFrom: page.filters.amountFrom,
        amountTo: page.filters.amountTo,
        sortType: page.filters.sortType,
        sortDirection: page.filters.sortDirection,
      };

        return this.http.post(`${environment.API}api/ticket/list`, JSON.stringify(params))
                 .map((res: Response) => {
                    const pagedData = new PagedData<TicketSelectorModel>();
                    page.totalElements = res.json().total;
                    page.totalPages = page.totalElements / page.size;
                    pagedData.data = res.json().items.map((item: any) => {
                      return new TicketSelectorModel().deserialize(item);
                    });
                    pagedData.page = page;
                    return pagedData;
                 })
                 .catch((err: any) => this.logService.handleHttpResponseError(err));
      } catch (error) {
        this.logService.error('TicketSelectorService.getTickets - Unexpected Error', error);
        return Observable.throw('ErrUnexpected');
      }
  }
}
