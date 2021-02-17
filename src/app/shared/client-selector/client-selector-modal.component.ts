import { Component, OnInit, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { ClientSelectorModel } from './client-selector.model';

@Component({
  moduleId: module.id,
  selector: 'client-selector-modal',
  template: `
    <h2 md-dialog-title class="mat-dialog-title--strech">{{dialogTitle | translate}}</h2>
    <md-dialog-content>
      <client-selector-grid [multipleSelection]="multipleSelection" (onSelectionChange)="onSelectionChange($event)"></client-selector-grid>
    </md-dialog-content>
    <md-dialog-actions>
      <button md-raised-button color="primary" style="margin-right: 16px;" (click)="onAction()" [disabled]="!hasSelection()">
        {{'select' | translate}}</button>
      <button md-raised-button color="secondary" (click)="onCancel()">{{'cancel' | translate}}</button>
    </md-dialog-actions>
  `
})
export class ClientSelectorModalComponent implements OnInit {
  @Input() multipleSelection: boolean;
  dialogTitle: string;
  selectedClients: Array<ClientSelectorModel> = [];

  constructor(private dialogRef: MdDialogRef<ClientSelectorModalComponent>,
              private translate: TranslateService
              ) { }

  ngOnInit() {
    this.dialogTitle = this.translate.instant(this.multipleSelection ? 'select clients' : 'select a client');
  }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({
      doAction: true,
      selected: this.selectedClients
    });
  }

  onSelectionChange(selection: Array<ClientSelectorModel>): void {
    this.selectedClients = selection;
  }

  hasSelection(): boolean {
    return this.selectedClients.length > 0;
  }
}
