import { TranslateService } from './../../core/translate/translate.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MdDialogRef, MdSnackBar } from '@angular/material';

import { BannerService } from './banner.service';
import { BannerModel } from './banner.model';
import { PageLoaderService } from '../../shared/page-loader-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'banner-create-or-edit-dialogue',
  templateUrl: 'banner-create-or-edit-dialogue.component.html',
  styleUrls: ['banner-create-or-edit-dialogue.component.scss']
})
export class BannerCreateOrEditDialogueComponent implements OnInit {

  banner: BannerModel = new BannerModel();
  edit: boolean = false;
  title: string;
  bannerForm: FormGroup;
  fileImage: SafeResourceUrl = '';
  fileName: string = '';

  constructor(private dialogRef: MdDialogRef<BannerCreateOrEditDialogueComponent>,
              private bannerService: BannerService,
              private pageLoaderService: PageLoaderService,
              private fb: FormBuilder,
              private snackBar: MdSnackBar,
              private cd: ChangeDetectorRef,
              private translate: TranslateService,
              private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.title = `banner_${this.edit ? 'edit' : 'create'}`;
    this.initForm();
    if (this.banner.file) {
      this.fileImage = this._sanitizer.bypassSecurityTrustResourceUrl(`data:${this.banner.fileType};base64,${this.banner.file}`);
    }
  }

  get imagenPath() {
    return this.bannerForm.get('imagenPath');
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
        this.fileImage = reader.result;
        this.fileName = file.name;
        this.bannerForm.patchValue({
          file: reader.result.toString().split(',')[1]
        });
      };
    }
  }

  createOrEdit(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    const banner: BannerModel = new BannerModel();
    banner.titulo = this.bannerForm.controls['titulo'].value;
    banner.subTitulo = this.bannerForm.controls['subTitulo'].value;
    banner.imagenPath = this.fileName;
    banner.posicionX = this.bannerForm.controls['posicionX'].value;
    banner.posicionY = this.bannerForm.controls['posicionY'].value;
    banner.alineadoIzquierda = this.bannerForm.controls['alineadoIzquierda'].value;
    banner.anchoSubtitulo = this.bannerForm.controls['anchoSubtitulo'].value;
    banner.file = this.bannerForm.controls['file'].value;
    if (this.edit) {
      banner.bannerMainId = this.bannerForm.controls['bannerMainId'].value;
      this.bannerService.edit(banner).subscribe((result: boolean) => {
        this.snackBar.open(this.translate.instant('banner edit'), '', {
          duration: 10000
        });
        this.dialogRef.close({doAction: true});
        this.pageLoaderService.setPageLoadingStatus(false);
      }, () => {
        this.snackBar.open(this.translate.instant('banner error edit'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
        this.pageLoaderService.setPageLoadingStatus(false);
      }
      );
    } else {
      this.bannerService.add(banner).subscribe((result: boolean) => {
        this.snackBar.open(this.translate.instant('banner add'), '', {
          duration: 10000
        });
        this.dialogRef.close({doAction: true});
        this.pageLoaderService.setPageLoadingStatus(false);
      }, () => {
        this.snackBar.open(this.translate.instant('banner error add'), '', {
          duration: 10000,
          extraClasses: ['snackError']
        });
        this.pageLoaderService.setPageLoadingStatus(false);
      }
      );
    }
  }

  private initForm(): void {
    this.bannerForm = this.fb.group({
      bannerMainId: [this.banner.bannerMainId],
      titulo: [this.banner.titulo],
      subTitulo: [this.banner.subTitulo],
      posicionX: [this.banner.posicionX],
      posicionY: [this.banner.posicionY],
      alineadoIzquierda: [this.banner.alineadoIzquierda],
      anchoSubtitulo: [this.banner.anchoSubtitulo],
      file: [this.banner.file]
    });
  }

}
