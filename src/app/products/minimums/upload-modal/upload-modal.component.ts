import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { ProductService } from '../../service/products.service';
import { CartBrandModel } from '../../../cart/model/cart-brand.model';

@Component({
  moduleId: module.id,
  templateUrl: 'upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadMinimumsFileModalComponent implements OnInit {
  @Input() brand:CartBrandModel;
  error: string;
  dragAreaClass: string;
  droppedFile:File = null;

  constructor(private dialogRef: MdDialogRef<UploadMinimumsFileModalComponent>,
              private productService: ProductService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService
              ) { }

  ngOnInit() {
    this.dragAreaClass = "dragarea";
  }
            
  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }

  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }

  saveFiles(files: FileList) {
    // if (files.length > 1){
    //    this.error = "only one file at time allow";
    //    return;
    // }
    if(!files[0].name.endsWith('xlsx')){
       this.error = "file must be .xlsx";
       return;
    }
    this.error = "";
    this.droppedFile = files[0];
    console.log(files[0].size,files[0].name,files[0].type);
    return;
  }

  onDeleteFile(){
    this.droppedFile = null;
    this.dragAreaClass = "dragarea";
  }
              
  onCancel() {
    this.dialogRef.close({ doAction: false});
  }

  openFile(){
    document.querySelector('input').click();
  }
  
  onAction() {
    this.dialogRef.close({
      doAction: true,
      file: this.droppedFile
    });
  }

}
