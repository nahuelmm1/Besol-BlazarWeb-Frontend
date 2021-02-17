import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'bla-pill',
    templateUrl: 'pill.component.html',
    styleUrls: ['./pill.component.scss']
  })
  export class PillComponent {
    @Input() text: string;
    @Input() showCloseButton: boolean;
    @Output() onClose = new EventEmitter();

    constructor() { }

    onCloseClick(event): void {
        this.onClose.emit();
        event.preventDefault();
    }
}
