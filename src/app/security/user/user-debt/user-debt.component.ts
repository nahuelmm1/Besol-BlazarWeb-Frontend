import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationBarService } from '../../../shared/notification-bar-service/notification-bar-service';
import { PageLoaderService } from '../../../shared/page-loader-service';
import { UserService } from '../../service/user.service';
import { MdDialog } from '@angular/material';
import { User } from '../../../shared/models/user.model';


@Component({
  moduleId: module.id,
  templateUrl: 'user-debt.component.html',
  styleUrls: ['user-debt.component.scss'],
})
export class UserDebtComponent implements OnInit {
  @ViewChild('amount') amount: ElementRef;

  id: string;
  user: User = new User();

  changepasswordForm: FormGroup;

  constructor(
    private userService: UserService,
    private notificationBar: NotificationBarService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogService: MdDialog,
    private pageLoaderService: PageLoaderService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initPasswordForm();
    this.initValues();
  }

  initPasswordForm(): void {

    this.changepasswordForm = this.formBuilder.group({
      newpassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.userService.getPasswordPattern())
      ]],
      repeatpassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.userService.getPasswordPattern())
      ]],
    });

    this.amount.nativeElement.focus();
  }

  initValues(): void {

    this.route.paramMap
      .switchMap((params: ParamMap) => {
        this.pageLoaderService.setPageLoadingStatus(true);
        this.id = params.get('id');
        return this.userService.getUser(parseInt(this.id, 10));
      })
      .subscribe(
        (user: User) => {
          this.pageLoaderService.setPageLoadingStatus(false);
          this.user = user;
        },
        (err) => {
          this.notificationBar.error(err);
          this.pageLoaderService.setPageLoadingStatus(false);
        }
      );
  }

  onGoBack() {
    this.route.data.subscribe((value) => {
      this.router.navigate([value.navigateBack]);
    });
  }
}
