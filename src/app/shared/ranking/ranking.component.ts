import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'bla-ranking',
    templateUrl: 'ranking.component.html'
  })
  export class RankingComponent {
    @Input() value: number;
    total: number[] = [1, 2, 3, 4, 5];
    constructor() { }
}
