import { Component, OnInit, Renderer } from '@angular/core';

import { TranslateService } from '../../core/translate/translate.service';

import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { GroupModel } from '../../cart/model/Group.model';
import { PageLoaderService } from '../../shared/page-loader-service';
import { ParameterModel } from './model/parameter.model';
import { ParameterService } from './parameter.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  moduleId: module.id,
  templateUrl: 'parameter.component.html',
})

export class ParameterComponent implements OnInit {
  loading: boolean = false;
  groups: Array<GroupModel>;
  parameterData: Array<ParameterModel>;
  frmSettings: FormGroup;

  get settings(): FormArray {
    return this.frmSettings.get('settings') as FormArray;
  }

  constructor(private parameterService: ParameterService,
              public renderer: Renderer,
              private notificationBar: NotificationBarService,
              private pageLoaderService: PageLoaderService,
              private fb: FormBuilder,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.loadData();
    window['vm'] = this;
  }

  loadData(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.parameterService.getAll().subscribe(
      (paramseters) => {
        this.parameterData = paramseters;
        this.initForm();
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  save(): void {
    const changedSettings: Array<ParameterModel> = this.frmSettings.value.settings.filter((setting, index) => {
      return setting.value !== this.parameterData[index].value;
    });

    if (changedSettings.length) {
      this.pageLoaderService.setPageLoadingStatus(true);
      this.parameterService.update(changedSettings).subscribe(
        () => {
          this.loadData();
        },
        (err) => {
          this.pageLoaderService.setPageLoadingStatus(false);
          this.notificationBar.error(err);
        }
      );
    }
    this.settings.controls.forEach((group) => {
      group.get('value').markAsPristine();
      group.get('value').markAsUntouched();
    });
  }

  private initForm(): void {
    const settings = this.parameterData.map((setting) => {
      return this.buildSettingRow(setting);
    });
    this.frmSettings = this.fb.group({
      settings: this.fb.array(settings),
    });
  }

  private buildSettingRow(setting: ParameterModel) {
    return this.fb.group({
      appSettingId: [setting.appSettingId, []],
      value: [setting.value, []],
    });
  }
}
