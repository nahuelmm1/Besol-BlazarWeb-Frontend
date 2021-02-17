import { Component, Input } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { TranslateService } from '../../../core/translate/translate.service';
import { ProductMovementsModalService } from '../../../shared/product-movements/product-movements-modal.service';

@Component({
  moduleId: module.id,
  templateUrl: 'physical-product-modal.component.html'
})
export class PhysicalProductModalComponent {
  @Input()productIds: Array<number>;
  @Input()description: string;

  constructor(private dialogRef: MdDialogRef<PhysicalProductModalComponent>,
              private translate: TranslateService,
              private productMovementsModalService: ProductMovementsModalService,
              ) { }

  onClose() {
    this.dialogRef.close();
  }

  onViewMovements(event, productId: number): void {
    this.productMovementsModalService.show(this.description, productId);
    event.preventDefault();
  }
}
