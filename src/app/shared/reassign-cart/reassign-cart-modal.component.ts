import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit, Renderer } from '@angular/core';
import { MdDialogRef, MdSelect } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { PostMessageService } from '../post-message.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NotificationBarService } from '../notification-bar-service/notification-bar-service';
import { FormControl } from '@angular/forms';
import { ReassignCartAssigneeModel } from './reassign-cart.model';
import { ReassignCartService } from './reassign-cart.service';

@Component({
  moduleId: module.id,
  selector: 'reassign-cart-modal',
  templateUrl: 'reassign-cart-modal.component.html'
})
export class ReassignCartModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() cartNumber: number;
  assignee: FormControl;
  currentAssignee: string;
  userList: Array<ReassignCartAssigneeModel>;
  isLoading: boolean;
  @ViewChild('assigneeEl') assigneeEl: MdSelect;

  constructor(private dialogRef: MdDialogRef<ReassignCartModalComponent>,
    private translate: TranslateService,
    private notificationBar: NotificationBarService,
    private reassignCartService: ReassignCartService,
    private renderer: Renderer,
  ) {
              }

  ngOnInit() {
    this.isLoading = true;

    this.assignee = new FormControl();

    this.reassignCartService.getReassignData(this.cartNumber)
      .finally(() => this.isLoading = false)
      .subscribe(
        (data) => {
          this.userList = data.possibleAssignees;
          this.currentAssignee = data.currentAssignee;
        }
      );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderer.invokeElementMethod(this.assigneeEl._elementRef.nativeElement, 'focus', []);
    }, 1000);
  }

  ngOnDestroy(): void {
  }

  onCancel() {
    this.dialogRef.close({ doAction: false });
  }

  onAction() {
    if (!this.assignee.value) {
      this.notificationBar.error('ReassignCartAssigneeRequired');
    } else {
      this.isLoading = true;
      this.reassignCartService.reassign(this.cartNumber, this.assignee.value)
        .finally(() => this.isLoading = false)
        .subscribe(
          () => this.dialogRef.close({ doAction: true }),
          (err) => this.notificationBar.error(err)
        );
    }
  }
}
