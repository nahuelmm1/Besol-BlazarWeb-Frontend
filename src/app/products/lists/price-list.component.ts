import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../core/translate';
import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { ProductService } from '../service/products.service';

@Component({
  moduleId: module.id,
  templateUrl: 'price-list.component.html',
  styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent implements OnInit {
  error: string;
  dragAreaClass: string;
  droppedFile:File = null;
  isLoading: boolean = false;

  constructor(
              private productService: ProductService,
              private notificationBar: NotificationBarService,
              private translate: TranslateService,
                 private productsService:ProductService
              ) { }

  ngOnInit() {
    this.dragAreaClass = "dragarea";
  }
            
  onFileChange(event: any) {
    if(event.target.files!==undefined && event.target.files!==null){
      let files: FileList = event.target.files;
      this.saveFiles(files);
    }
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
    if(files.length>=0){
      if((files[0].name!=="ListaDePrecios.xls") && (files[0].name!=="ListaDePrecios.pdf")){
        this.error = "price-list-error";
        return;
     }
     this.error = "";
     this.droppedFile = files[0];
     console.log(files[0].size,files[0].name,files[0].type);
     return; 
    }
  }

  onDeleteFile(){
    this.droppedFile = null;
    this.dragAreaClass = "dragarea";
  }
              

  openFile(){
    document.querySelector('input').click();
  }
  
  onAction() {
    if(this.droppedFile===undefined || this.droppedFile===null){
      return;
    }
    if(this.droppedFile.name==="ListaDePrecios.pdf"){
      this.productsService.uploadpriceListPdf(this.droppedFile).subscribe(
        (res) => {
          this.isLoading = false;
          this.notificationBar.success(this.translate.instant('successful operation'));
          this.droppedFile = null;
        },
        (err) => {
          this.isLoading = false;
          if(typeof(err)==="string")
            this.notificationBar.error(err);          
          else
            this.notificationBar.error(err.json());
        });  
    }
    else if(this.droppedFile.name==="ListaDePrecios.xls"){
    this.productsService.uploadpriceListXls(this.droppedFile).subscribe(
      (res) => {
        this.isLoading = false;
        this.notificationBar.success(this.translate.instant('successful operation'));
        this.droppedFile = null;
      },
      (err) => {
        this.isLoading = false;
        if(typeof(err)==="string")
          this.notificationBar.error(err);          
        else
          this.notificationBar.error(err.json());
      });  
    }

  }

}
