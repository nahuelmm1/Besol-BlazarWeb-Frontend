import { Component, OnInit, Renderer } from '@angular/core';

import { TranslateService } from '../../core/translate/translate.service';

import { NotificationBarService } from '../../shared/notification-bar-service/notification-bar-service';
import { OperationService } from './operation.service';
import { GroupModel } from '../../cart/model/Group.model';
import { OperationModel } from './model/operation.model';
import { OperationGroupModel } from './model/operation-group.model';
import { PageLoaderService } from '../../shared/page-loader-service';

const EXCLUDED_GROUPS_IDS = [1, 2, 3];

@Component({
  moduleId: module.id,
  templateUrl: 'operations.component.html',
})

export class OperationsComponent implements OnInit {
  loading: boolean = false;
  groups: Array<GroupModel>;
  operations: Array<OperationModel>;
  operationGroupMatrix: Array<Array<boolean>>;
  editingGroups: Array<boolean>;

  constructor(private operationService: OperationService,
              public renderer: Renderer,
              private notificationBar: NotificationBarService,
              private pageLoaderService: PageLoaderService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.operationService.getOperations().subscribe(
      (response) => {
        this.groups = response.groups.filter(({ groupId }) => !EXCLUDED_GROUPS_IDS.includes(groupId));
        this.operations = response.operations;
        this.buildMatrix(response.operationGroups);
        this.pageLoaderService.setPageLoadingStatus(false);
      }
    );
  }

  buildMatrix(operationGroups: Array<OperationGroupModel>): void {
    const matrix = [];
    const editingGroups = [];
    this.groups.forEach(({ groupId }) => {
      const groupOperations = [];
      this.operations.forEach(({ operationId }) => {
        const exists = operationGroups.find(
          (og) => og.operationId === operationId && og.groupId === groupId);
        groupOperations.push(!!exists);
      });
      matrix.push(groupOperations);
      editingGroups.push(false);
    });
    this.operationGroupMatrix = matrix;
    this.editingGroups = editingGroups;
  }

  toggleEditGroup($event, groupIndex): void {
    $event.preventDefault();
    this.editingGroups[groupIndex] = !this.editingGroups[groupIndex];
  }

  onOperationChange($event, groupIndex, operationIndex): void {
    this.operationGroupMatrix[groupIndex][operationIndex] = $event.checked;
  }

  save(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    const operationGroups: Array<OperationGroupModel> = [];
    this.groups.forEach(({ groupId }, groupIndex) => {
      this.operations.forEach(({ operationId }, operationIndex) => {
        if (this.operationGroupMatrix[groupIndex][operationIndex]) {
          operationGroups.push(new OperationGroupModel().deserialize({
            groupId,
            operationId,
          }));
        }
      });
    });
    this.operationService.updateOperations(operationGroups).subscribe(
      (responseOperationGroups) => {
        this.buildMatrix(responseOperationGroups);
        this.pageLoaderService.setPageLoadingStatus(false);
      },
      (err) => this.notificationBar.error(err)
    );
  }
}
