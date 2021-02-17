import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { fadeInAnimation } from '../route.animation';

import { noop } from 'rxjs/util/noop';

import { AuthService } from '../shared/auth.service';
import { TranslateService } from '../core/translate/translate.service';
import { PageLoaderService } from '../shared/page-loader-service';
import { NotificationBarService } from '../shared/notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  host: {
    '[@fadeInAnimation]': 'true'
  },
  animations: [ fadeInAnimation ]
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  loginForm: FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private auth: AuthService,
              private notificationBar: NotificationBarService,
              private translation: TranslateService,
              private pageLoaderService: PageLoaderService)  { }

  ngOnInit() {
    this.initForm();
    this.setReturnUrl();
  }

  initForm(): void {
      this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    this.pageLoaderService.setPageLoadingStatus(true);
    this.auth.login({
      user: this.loginForm.get('user').value,
      password: this.loginForm.get('password').value,
      remember: false
    })
    .finally(() => this.pageLoaderService.setPageLoadingStatus(false))
    .subscribe(
      (res: any) => {
        const retUrl = this.returnUrl.startsWith('/login') ? '/' : this.returnUrl;
        this.router.navigateByUrl(retUrl)
          .then(() => noop())
          .catch(() => this.router.navigate(['/']));
      },
      (err: string) => {
        this.notificationBar.error(err);
      }
    );
  }

  private setReturnUrl(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
}
