import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'confirm-dialogue',
  template: `
  <h2 md-dialog-title>{{titleMessage}}</h2>
    <md-dialog-content [innerHTML]="contentMessage">
    </md-dialog-content>
    <md-dialog-actions>
      <button md-raised-button color="primary" style="margin-right: 16px;" (click)="onAction()">{{actionMessage}}</button>
      <button md-raised-button color="secondary" (click)="onCancel()">{{cancelMessage}}</button>
    </md-dialog-actions>
  `
})
export class ConfirmDialogueComponent  {
  titleMessage: string = '';
  contentMessage: string = '';
  actionMessage: string = '';
  cancelMessage: string = '';

  constructor(private dialogRef: MdDialogRef<ConfirmDialogueComponent>) { }

  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  onAction() {
    this.dialogRef.close({ doAction: true});
  }
}
