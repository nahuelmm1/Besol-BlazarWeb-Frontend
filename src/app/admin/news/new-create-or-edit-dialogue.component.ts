import { NewService } from './new.service';
import { TranslateService } from '../../core/translate/translate.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MdDialogRef, MdSnackBar } from '@angular/material';

import { PageLoaderService } from '../../shared/page-loader-service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NewModel } from './new.model';

@Component({
  moduleId: module.id,
  selector: 'new-create-or-edit-dialogue',
  templateUrl: 'new-create-or-edit-dialogue.component.html',
  styleUrls: ['new-create-or-edit-dialogue.component.scss']
})
export class NewCreateOrEditDialogueComponent implements OnInit {

  _new: NewModel = new NewModel();
  edit: boolean = false;
  title: string = 'new_create';
  newForm: FormGroup;
  fileImage: SafeResourceUrl = '';
  fileName: string = '';

  constructor(private dialogRef: MdDialogRef<NewCreateOrEditDialogueComponent>,
              private newService: NewService,
              private pageLoaderService: PageLoaderService,
              private fb: FormBuilder,
              private snackBar: MdSnackBar,
              private translate: TranslateService,
              private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.title = `new_${this.edit ? 'edit' : 'create'}`;
    this.fileImage = this._new.fileImage;
    this.initForm();
  }

  closeModal(): void {
    this.dialogRef.close({doAction: false});
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileImage = this._sanitizer.bypassSecurityTrustStyle(`url(${reader.result})`);
        this.fileName = file.name;
        this.newForm.patchValue({
          file: reader.result.toString().split(',')[1]
        });
      };
    }
  }

  createOrEdit(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    const _new: NewModel = new NewModel();
    _new.title = this.newForm.controls['title'].value;
    _new.text = this.newForm.controls['text'].value;
    _new.image = this.fileName;
    _new.file = this.newForm.controls['file'].value;
    if (this.edit) {
      _new.newId = this.newForm.controls['newId'].value;
      this.newService.edit(_new).subscribe((result: boolean) => {
        this.snackBar.open(this.translate.instant('new edit'), '', {
          duration: 10000
        });
        this.dialogRef.close({doAction: true});
        this.pageLoaderService.setPageLoadingStatus(false);
      }, () => {
        this.snackBar.open(this.translate.instant('new error edit'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
        this.pageLoaderService.setPageLoadingStatus(false);
      }
      );
    } else {
      this.newService.add(_new).subscribe((result: boolean) => {
        this.snackBar.open(this.translate.instant('new add'), '', {
          duration: 10000
        });
        this.dialogRef.close({doAction: true});
        this.pageLoaderService.setPageLoadingStatus(false);
      }, () => {
        this.snackBar.open(this.translate.instant('new error add'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
        this.pageLoaderService.setPageLoadingStatus(false);
      }
      );
    }
  }

  private initForm(): void {
    this.newForm = this.fb.group({
      newId: [this._new.newId],
      title: [this._new.title],
      text: [this._new.text],
      file: [this._new.file]
    });
  }

}
