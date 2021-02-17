import { BannerCreateOrEditDialogueComponent } from './banner-create-or-edit-dialogue.component';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';

import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

import { BannerModel } from './banner.model';

import { BannerService } from './banner.service';
import { PageLoaderService } from './../../shared/page-loader-service';
import { BannerDeleteDialogueComponent } from './banner-delete-dialogue.component';
import { TranslateService } from '../../core/translate';

@Component({
  moduleId: module.id,
  templateUrl: 'banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit {

  bannerDraggables = [];
  bannerData: BannerModel[];
  bannerMove: boolean = false;

  constructor(private bannerService: BannerService,
              public dialogService: MdDialog,
              private snackBar: MdSnackBar,
              private pageLoaderService: PageLoaderService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadBanner();
  }

  onDragged(item: any, list: any[], effect: DropEffect): void {
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDrop(event: DndDropEvent, list?: any[] ): void {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = list.length;
      }
      list.splice(index, 0, event.data);
      if (index !== event.data.orden + 1) {
        this.bannerMove = true;
      }
    }
  }

  addBanner(): void {
    const dialogRef = this.dialogService.open(BannerCreateOrEditDialogueComponent, { width: '40%', disableClose: true});
    dialogRef.componentInstance.edit = false;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.loadBanner();
        }
      });
  }

  saveBanner(): void {
    const banners: any[] = this.bannerDraggables.map((banner) => {
      return {
        bannerMainId: banner['bannerMainId'],
        orden: this.bannerDraggables.indexOf(banner)
      };
    });
    this.bannerService.update(banners).subscribe(() => {
      this.bannerMove = false;
      this.snackBar.open(this.translate.instant('banner update'), '', {
        duration: 10000
      });
    }, () => {
      this.snackBar.open(this.translate.instant('banner error update'), '', {
        duration: 10000,
        extraClasses: ['snackError']
      });
    });
  }

  editBanner(banner: any): void {
    this.bannerService.get(banner.bannerMainId).subscribe(
      (bannerEdit: BannerModel) => {
        const dialogRef = this.dialogService.open(BannerCreateOrEditDialogueComponent, { width: '40%'});
        dialogRef.componentInstance.banner = bannerEdit;
        dialogRef.componentInstance.edit = true;
        dialogRef.afterClosed().subscribe(
          (result) => {
            if (result.doAction) {
              this.loadBanner();
            }
          });
      },
      () => {
        this.snackBar.open(this.translate.instant('banner error get'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
      }
    );
  }

  deleteBanner(bannerId: number): void {
    const dialogRef = this.dialogService.open(BannerDeleteDialogueComponent, { width: '30%'});
    dialogRef.componentInstance.banner =  bannerId;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.loadBanner();
        }
      });
  }

  private loadBanner(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.bannerService.getAll().subscribe(
      (banners) => {
        this.bannerData = banners;
        this.initForm();
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      () => {
        this.snackBar.open(this.translate.instant('banner error get'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  private initForm(): void {
    this.bannerDraggables = this.bannerData.map(
      (banner: BannerModel) => {
        return {...banner,
          effectAllowed: 'move',
          disable: false,
          handle: true
        };
      }
    );
  }

}
