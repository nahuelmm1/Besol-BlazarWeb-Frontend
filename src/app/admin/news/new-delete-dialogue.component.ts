import { Component } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { NewService } from './new.service';
import { TranslateService } from '../../core/translate';

@Component({
  moduleId: module.id,
  selector: 'new-delete-dialogue',
  templateUrl: 'new-delete-dialogue.component.html',
})
export class NewDeleteDialogueComponent {

  newId: number = 0;

  constructor(private dialogRef: MdDialogRef<NewDeleteDialogueComponent>,
              private newService: NewService,
              private snackBar: MdSnackBar,
              private translate: TranslateService) { }

  closeModal() {
    this.dialogRef.close({doAction: false});
  }

  deleteNew() {
      this.newService.delete(this.newId).subscribe(() => {
          this.snackBar.open(this.translate.instant('new delete'), '', {
            duration: 10000
          });
          this.dialogRef.close({doAction: true});
      }, () => {
        this.snackBar.open(this.translate.instant('new error delete'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
      }
      );
  }

}
