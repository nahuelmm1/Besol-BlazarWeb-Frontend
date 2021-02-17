import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';

@Component({
  selector: 'availability-edit',
  templateUrl: './availability-edit.component.html',
  styleUrls: ['./availability-edit.component.scss']
})
export class AvailabilityEditComponent implements OnInit {

  event: any; // CalendarEvent;
  frmEvent: FormGroup;
  hourList = [];

  constructor(
    private dialogRef: MdDialogRef<AvailabilityEditComponent>,
    private fb: FormBuilder,
    private supplierService: SupplierService,
  ) { }

  ngOnInit() {
    this.hourList = new Array(24).fill(0, 0, 24).map((val, index) => ({
      value: index,
      label: `${index}:00`
    }));

    this.event = this.dialogRef.componentInstance.event;
    const day = moment(this.event.start).startOf('date').toDate();
    const start = moment(this.event.start).hour();
    const end = moment(this.event.end).hour();

    this.frmEvent = this.fb.group({
      date: [day],
      start: [start],
      end: [end]
    });
  }

  save() {
    const values = this.frmEvent.value;
    this.event.start = moment(values.date).add(values.start, 'hours').toDate();
    this.event.end = moment(values.date).add(values.end, 'hours').toDate();

    if (this.event.id) {
      this.supplierService.updateAvailability(this.event).subscribe(() => {
        this.dialogRef.close(this.event);
      });
    } else {
      this.supplierService.createAvailability(this.event).subscribe(() => {
        this.dialogRef.close(this.event);
      });
    }

  }
}
