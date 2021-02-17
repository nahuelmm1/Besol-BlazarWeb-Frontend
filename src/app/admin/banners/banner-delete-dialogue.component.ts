import { Component } from '@angular/core';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { BannerService } from './banner.service';
import { TranslateService } from '../../core/translate';

@Component({
  moduleId: module.id,
  selector: 'banner-delete-dialogue',
  templateUrl: 'banner-delete-dialogue.component.html',
})
export class BannerDeleteDialogueComponent {

  banner: number = 0;

  constructor(private dialogRef: MdDialogRef<BannerDeleteDialogueComponent>,
              private bannerService: BannerService,
              private snackBar: MdSnackBar,
              private translate: TranslateService) { }

  closeModal() {
    this.dialogRef.close({doAction: false});
  }

  deleteBanner() {
      this.bannerService.delete(this.banner).subscribe(() => {
          this.snackBar.open(this.translate.instant('banner delete'), '', {
            duration: 10000
          });
          this.dialogRef.close({doAction: true});
      }, () => {
        this.snackBar.open(this.translate.instant('banner error delete'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
      }
      );
  }

}
