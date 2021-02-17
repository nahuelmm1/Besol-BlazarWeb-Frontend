import { Component, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'user-dialogue',
  templateUrl: 'user-dialogue.component.html',
})
export class UserDialogueComponent {

  dialogueTitle: string = '';
  dialogueMessage: string = '';
  dialogueAdditionalMessage: string = '';

  constructor(private dialogRef: MdDialogRef<UserDialogueComponent>) { }

  onOk() {
    this.dialogRef.close({ doAction: true });
  }

  onCancel() {
    this.dialogRef.close({ doAction: false });
  }

}
