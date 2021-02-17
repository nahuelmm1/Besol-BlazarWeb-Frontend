import { NewCreateOrEditDialogueComponent } from './new-create-or-edit-dialogue.component';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';

import { NewService } from './new.service';
import { PageLoaderService } from '../../shared/page-loader-service';
import { TranslateService } from '../../core/translate';
import { NewModel } from './new.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NewDeleteDialogueComponent } from './new-delete-dialogue.component';

@Component({
  moduleId: module.id,
  templateUrl: 'new.component.html',
  styleUrls: ['./new.component.scss']
})

export class NewComponent implements OnInit {

  newsData: NewModel[];

  constructor(private newService: NewService,
              public dialogService: MdDialog,
              private snackBar: MdSnackBar,
              private pageLoaderService: PageLoaderService,
              private translate: TranslateService,
              private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadNews();
  }

  addNew(): void {
    const dialogRef = this.dialogService.open(NewCreateOrEditDialogueComponent, { width: '40%', disableClose: true});
    dialogRef.componentInstance.edit = false;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.loadNews();
        }
      });
  }

  editNew(_new: NewModel): void {
    const dialogRef = this.dialogService.open(NewCreateOrEditDialogueComponent, { width: '40%'});
    dialogRef.componentInstance._new = _new;
    dialogRef.componentInstance.edit = true;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.loadNews();
        }
      });
  }

  deleteNew(newId: number): void {
    const dialogRef = this.dialogService.open(NewDeleteDialogueComponent, { width: '30%'});
    dialogRef.componentInstance.newId =  newId;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.doAction) {
          this.loadNews();
        }
      });
  }

  private loadNews(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.newService.getAll().subscribe(
      (news: NewModel[]) => {
        this.newsData = news.map((_new: NewModel) => {
          if (_new.file) {
            _new.fileImage = this._sanitizer.bypassSecurityTrustStyle(`url("data:${_new.fileType};base64,${_new.file}")`);
          }
          return _new;
        });
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => {
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

}
