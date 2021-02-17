import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../core/translate/translate.service';
import { PostMessageService } from '../post-message.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ProductMovementsService } from './product-movements.service';
import { PointOfSaleService } from '../point-of-sale.service';
import { NotificationBarService } from '../notification-bar-service/notification-bar-service';

@Component({
  moduleId: module.id,
  selector: 'product-movements-modal',
  templateUrl: 'product-movements-modal.component.html'
})
export class ProductMovementsModalComponent implements OnInit, OnDestroy {
  @Input() productId: number;
  @Input() description: string;
  isLoading: boolean;
  frameHeight: number = 100;
  frameWidth: number = 100;
  doneSubscription: Subscription;
  resizeSubscription: Subscription;
  @ViewChild('frmSequence') frmSequence: ElementRef;
  private incomeLabel: string;
  private outcomeLabel: string;

  constructor(private dialogRef: MdDialogRef<ProductMovementsModalComponent>,
    private translate: TranslateService,
    private postMessageService: PostMessageService,
    private productMovementsService: ProductMovementsService,
    private pointOfSaleService: PointOfSaleService,
    private notificationBar: NotificationBarService,
  ) {
    this.incomeLabel = this.translate.instant('income');
    this.outcomeLabel = this.translate.instant('outcome');

    }

  ngOnInit() {
    this.isLoading = true;

  }

  ngOnDestroy(): void {
    if (this.doneSubscription) {
      this.doneSubscription.unsubscribe();
    }

    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  onClose() {
    this.dialogRef.close({ doAction: false});
  }

  onSequenceLoad($event) {
    this.doneSubscription = this.postMessageService.subscribe('done', (payload) => {
      this.isLoading = false;
    });

    this.resizeSubscription = this.postMessageService.subscribe('resize', (payload) => {
      this.frameHeight = payload.height;
      this.frameWidth = payload.width;
    });

    Observable.zip(
      this.productMovementsService.getMovements(this.productId),
      this.pointOfSaleService.getAll().map((posList) => {
        return posList.reduce((map, pos) => {
          map[pos.pointOfSaleId] = pos.name;
          return map;
        }, {});
      })
    ).subscribe(([movements, pointOfServices]) => {
      if (movements.length === 0) {
        this.notificationBar.error('ErrNoProductMovementsFound');
        this.onClose();
        return;
      }
      const diagram = movements.map((move) => {
        const from = pointOfServices[move.from] || this.incomeLabel;
        const to = pointOfServices[move.to] || this.outcomeLabel;
        return `${from}->${to}: ${move.description}\\n${move.date}`;
      }).join('\n');
      this.postMessageService.send(this.frmSequence.nativeElement.contentWindow, 'draw', diagram);
    });
  }
}
