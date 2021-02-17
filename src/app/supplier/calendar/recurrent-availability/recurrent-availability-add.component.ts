import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import * as moment from 'moment';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';

@Component({
  selector: 'recurrent-availability-add',
  templateUrl: './recurrent-availability-add.component.html',
  styleUrls: ['./recurrent-availability-add.component.scss']
})
export class RecurrentAvailabilityAddComponent implements OnInit {

  event: any; // CalendarEvent;
  frmEvent: FormGroup;
  hourList = [];

  get errors(): any {
    const dateEnd = this.frmEvent.get('dateEnd');
    return {
      ...this.frmEvent.errors,
      dateEndRequired: dateEnd.errors && dateEnd.errors.required,
    };
  }

  get dayTouched(): boolean {
    return this.frmEvent.get('monday').touched
      || this.frmEvent.get('tuesday').touched
      || this.frmEvent.get('wednesday').touched
      || this.frmEvent.get('thursday').touched
      || this.frmEvent.get('friday').touched
      || this.frmEvent.get('saturday').touched;
  }

  get hourTouched(): boolean {
    return this.frmEvent.get('hourStart').touched
      || this.frmEvent.get('hourEnd').touched;
  }

  constructor(
    private dialogRef: MdDialogRef<RecurrentAvailabilityAddComponent>,
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

    const dayRequiredValidator = (control: AbstractControl) => {
      const monday = control.get('monday').value;
      const tuesday = control.get('tuesday').value;
      const wednesday = control.get('wednesday').value;
      const thursday = control.get('thursday').value;
      const friday = control.get('friday').value;
      const saturday = control.get('saturday').value;
      const anyDay = monday || tuesday || wednesday || thursday || friday || saturday;
      return anyDay ? null : { dayRequired: true };
    };

    const lessThanControlValidator = (control: AbstractControl, minorProp: string, mayorProp: string, errorKey: string) => {
      const minor = control.get(minorProp).value;
      const mayor = control.get(mayorProp).value;
      return minor < mayor ? null : { [errorKey]: true };
    };

    window['vm'] = this;

    this.frmEvent = this.fb.group({
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      dateStart: [day],
      dateEnd: [null, [Validators.required]],
      hourStart: [start],
      hourEnd: [end]
    }, {
      validator: (control: AbstractControl) => ({
        ...dayRequiredValidator(control),
        ...lessThanControlValidator(control, 'dateStart', 'dateEnd', 'badDateRange'),
        ...lessThanControlValidator(control, 'hourStart', 'hourEnd', 'badHourRange'),
      })
    });
  }

  save() {
    if (this.frmEvent.valid) {
      const values = this.frmEvent.value;

      this.supplierService.generateAvailability(values).subscribe(() => {
        this.dialogRef.close(values);
      });
    } else {
      this.showFormFieldValidations();
    }
  }

  private showFormFieldValidations(): void {
    Object.keys(this.frmEvent.controls).forEach((field) => {
      const control = this.frmEvent.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}
