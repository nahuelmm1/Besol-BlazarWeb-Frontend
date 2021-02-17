import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarDateFormatter
} from 'angular-calendar';
import {MdDialog, MdSnackBar} from '@angular/material';
import {AvailabilityEditComponent} from './availability-edit/availability-edit.component';
import {Subject} from 'rxjs/Subject';
import {fadeInAnimation} from '../../route.animation';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { SupplierService } from '../service/supplier.service';
import { TranslateService } from '../../core/translate';
import { ConfirmDialogueService } from '../../shared/confirm-dialogue/confirm-dialogue-service';
import { RecurrentAvailabilityAddComponent } from './recurrent-availability/recurrent-availability-add.component';

const eventPrototype = {
  title: '',
  color: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  draggable: true
};

@Component({
  selector: 'ms-calendar',
  templateUrl: './supplier-calendar.component.html',
  styleUrls: ['./supplier-calendar.component.scss'],
  host: {
    '[@fadeInAnimation]': 'true',
  },
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    },
  ],
  animations: [ fadeInAnimation ]
})
export class SupplierCalendarComponent implements OnInit {

  view: string = 'month';

  isLoading = false;

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  loadedMonth: number;

  actions: any[] = [{
    label: '<i class="icon">mode_edit</i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
      this.handleEvent('Edited', event);
    }
  }, {
    label: '<i class="icon">delete</i>',
    onClick: ({event}: {event: CalendarEvent}): void => {
      this.deleteEvent(event);
    }
  }];

  viewDate: Date = new Date();

  events: any[] = [];

  savedSuccessMessage: string = '';

  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef = this.dialogRef.open(AvailabilityEditComponent);
    dialogRef.componentInstance.event = event;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAvailability();
        event.title = result.title;
        this.snackBar.open(this.savedSuccessMessage);
      }
    });
  }

  deleteEvent(event: CalendarEvent): void {
    const start = moment(event.start).hour().toString();
    const end = moment(event.end).hour().toString();

    const confirmOpts = {
      contentMessage: this.translateService.instant('do you want to delete availability', [start, end]),
      titleMessage: this.translateService.instant('delete availability'),
      cancelMessage: this.translateService.instant('no'),
    };
    this.confirmService.confirm(confirmOpts).subscribe(result => {
      if (result && result.doAction) {
        this.supplierService.deleteAvailability(event).subscribe(() => {
          this.loadAvailability();
          this.snackBar.open(this.savedSuccessMessage);
        });
      }
    });
  }

  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {
    console.log('dayClicked', date);
    if (moment(this.viewDate).isSame(date, 'month')) {
      if (
        (moment(this.viewDate).isSame(date, 'day') && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  previousView($event): void {
    const month = moment(this.viewDate).month() + 1;
    if (month !== this.loadedMonth) {
      this.loadAvailability();
    }
  }

  nextView($event): void {
    const month = moment(this.viewDate).month() + 1;
    if (month !== this.loadedMonth) {
      this.loadAvailability();
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    // drag
    event.start = newStart;
    event.end = newEnd;
    // this.handleEvent('Dropped or resized', event);
    this.supplierService.updateAvailability(event).subscribe(() => {
      this.loadAvailability();
      this.snackBar.open(this.savedSuccessMessage);
    });
  }

  constructor(
    private dialogRef: MdDialog,
    private snackBar: MdSnackBar,
    private supplierService: SupplierService,
    private translateService: TranslateService,
    private confirmService: ConfirmDialogueService,
  ) {
    this.savedSuccessMessage = this.translateService.instant('availability saved with success');
  }

  ngOnInit() {
    this.loadAvailability();
    eventPrototype.title = this.translateService.instant('available');
  }

  loadAvailability(): void {
    this.isLoading = true;
    const date = moment(this.viewDate);
    const month = date.month() + 1;
    const year = date.year();
    this.loadedMonth = month;

    this.supplierService.getAvailability(year, month).subscribe((availability) => {
      this.events = availability.map((el) => {
        const start = moment(el.start).hour().toString();
        const end = moment(el.end).hour().toString();
        const title = this.translateService.instant('available from to', [start, end]);

        return {
          ...eventPrototype,
          ...el,
          actions: this.actions,
          title,
        };
      });
      this.isLoading = false;
      this.refresh.next();
    });
  }

  addAvailability() {
    const eventDate = moment(this.viewDate).startOf('date').add(9, 'hours');
    const event: CalendarEvent = {
      ...eventPrototype,
      start: eventDate.toDate(),
      end: eventDate.add(9, 'hours').toDate(),
    };
    const dialogRef = this.dialogRef.open(AvailabilityEditComponent);
    dialogRef.componentInstance.event = event;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAvailability();
        this.snackBar.open(this.savedSuccessMessage);
      }
    });
  }

  addRecurrentAvailability() {
    const eventDate = moment(this.viewDate).startOf('date').add(9, 'hours');
    const event: CalendarEvent = {
      ...eventPrototype,
      start: eventDate.toDate(),
      end: eventDate.add(9, 'hours').toDate(),
    };
    const dialogRef = this.dialogRef.open(RecurrentAvailabilityAddComponent);
    dialogRef.componentInstance.event = event;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAvailability();
        this.snackBar.open(this.savedSuccessMessage);
      }
    });
  }
}
