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
  templateUrl: 'user-password.component.html',
  styleUrls: ['user-password.component.scss'],
})
export class UserPasswordComponent implements OnInit {
  @ViewChild('password') password: ElementRef;

  id: string;
  user: User = new User();

  changepasswordForm: FormGroup;

  get newPassword() {
    return this.changepasswordForm.get('newpassword');
  }

  get repeatPassword() {
    return this.changepasswordForm.get('repeatpassword');
  }

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

    this.password.nativeElement.focus();
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



  onUpdate(): void {
    if (this.isValidForm()) {
      this.updatePassword();
    }
  }

  isValidForm(): boolean {
    let validForm: boolean = true;

    if (this.userService.isNotEquals(this.newPassword.value, this.repeatPassword.value)) {
      this.notificationBar.error('the fields must be equals');
      validForm = false;
    } else if (this.userService.isNotValidPassword(this.newPassword.value)
      && this.userService.isNotValidPassword(this.repeatPassword.value)) {
      this.notificationBar.error('needs at least one number and one letter');
      validForm = false;
    }

    return validForm;
  }

  updatePassword() {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.user.password = this.newPassword.value;

    this.userService
      .updatePassword(this.user)
      .finally(() => {
        this.pageLoaderService.setPageLoadingStatus(false);
      })
      .subscribe(
        resp => {
          this.notificationBar.success('password updated with success');
          this.onGoBack();
        },
        err => this.notificationBar.error(err)
      );
  }
}
