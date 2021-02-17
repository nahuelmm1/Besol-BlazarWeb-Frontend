import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'page-title-filter',
  templateUrl: 'page-title-filter.component.html'
})

export class PageTitleFilterComponent  {
  @Input() title: string;
  @Input() height: number = 68;
  @Input() showSearch: boolean = false;

  @Output() onFilterToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  toggleFilter(): void {
    this.showSearch = !this.showSearch;
    this.onFilterToggle.emit(this.showSearch);
  }
}
