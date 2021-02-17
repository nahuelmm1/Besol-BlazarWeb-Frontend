import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Log } from './log.model';

@Component({
  moduleId: module.id,
  selector: 'log-detail-dialogue',
  templateUrl: 'log-detail-dialogue.component.html',
})
export class LogDetailDialogueComponent {
  log: Log = null;
  excludedKeys: (key: string) => boolean;

  constructor(private dialogRef: MdDialogRef<LogDetailDialogueComponent>) { }

  closeModal() {
    this.dialogRef.close();
  }

  getKeys(): Array<string> {
    if (this.log) {
     return  Object.keys(this.log).filter(this.excludedKeys);
    }

    return new Array<string>();
  }
}
