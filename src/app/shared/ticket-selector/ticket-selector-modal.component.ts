import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { TicketSelectorModel } from './ticket-selector.model';

@Component({
  moduleId: module.id,
  selector: 'ticket-selector-modal',
  template: `
    <h2 md-dialog-title class="mat-dialog-title--strech">{{dialogTitle | translate}}</h2>
    <md-dialog-content>
      <ticket-selector-grid [multipleSelection]="multipleSelection" [filter]="filter" (onSelectionChange)="onSelectionChange($event)">
      </ticket-selector-grid>
    </md-dialog-content>
    <md-dialog-actions>
      <button md-raised-button color="primary" style="margin-right: 16px;" (click)="onAction()" [disabled]="!hasSelection()">
        {{'select' | translate}}</button>
      <button md-raised-button color="secondary" (click)="onCancel()">{{'cancel' | translate}}</button>
    </md-dialog-actions>
  `
})
export class TicketSelectorModalComponent implements OnInit {
  @Input() multipleSelection: boolean;
  @Input() filter: any;
  dialogTitle: string;
  selectedTickets: Array<TicketSelectorModel> = [];

  constructor(private dialogRef: MdDialogRef<TicketSelectorModalComponent>,
              private translate: TranslateService
              ) { }

  ngOnInit() {
    this.dialogTitle = this.translate.instant(this.multipleSelection ? 'select tickets' : 'select a ticket');
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({
      doAction: true,
      selected: this.selectedTickets
    });
  }

  onSelectionChange(selection: Array<TicketSelectorModel>): void {
    this.selectedTickets = selection;
  }

  hasSelection(): boolean {
    return this.selectedTickets.length > 0;
  }
}
