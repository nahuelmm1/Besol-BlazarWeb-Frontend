import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TranslateService } from '../translate/translate.service';
import { LocalStorageService } from '../../shared/local-storage.service';

@Component({
  moduleId: module.id,
  templateUrl: 'settings.component.html'
})

export class SettingsComponent implements OnInit {
  sizeList = [5, 10, 25, 50, 100];

  // filters
  pageSize = new FormControl();

  constructor(
    private localStorageService: LocalStorageService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    const settings = this.localStorageService.getComputerSettings();
    this.pageSize.setValue(settings.pageSize);
    this.pageSize.markAsPristine();

    this.pageSize.valueChanges.subscribe(
      (value) => {
        settings.pageSize = value;
        this.localStorageService.setComputerSettings(settings);
      }
    );
  }

}
