import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CartCommentModel } from '../../model/cart-comment.model';
import { FormControl } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'bla-cart-detail-internal-data',
  templateUrl: 'cart-detail-internal-data.component.html'
})

export class CartDetailInternalDataComponent {
  @Input() commentList: Array<CartCommentModel>;
  @Output() onAddComment = new EventEmitter<string>();
  newComment = new FormControl();

  onKeypress($event): void {
    if ($event.key === 'Enter') {
      this.addComment();
      $event.preventDefault();
    }
  }

  addComment($event = null): void {
    if ($event) {
      $event.preventDefault();
    }
    const comment = this.newComment.value;
    if (comment) {
      this.onAddComment.emit(comment);
      this.newComment.setValue('');
    }
  }
}
