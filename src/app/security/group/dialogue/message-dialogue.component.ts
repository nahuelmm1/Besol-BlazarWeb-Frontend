import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'message-dialogue',
  templateUrl: 'message-dialogue.component.html',
  styleUrls: ['message-dialogue.component.scss']
})
export class MessageDialogueComponent {

  dialogueTitle: string = '';
  dialogueMessage: string = '';
  dialogueAdditionalMessage: string = '';

  constructor(private dialogRef: MdDialogRef<MessageDialogueComponent>) { }

  onOk() {
    this.dialogRef.close({ doAction: true });
  }

}
