import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';


@Component({
    selector: 'app-dropdown-editor-renderer',
    template: `
    <select  #dropdownSelector>        
        <option *ngFor="let item of drowdownIems" [value]="item.id" [text]="item.name" >{{item.name}}</option>
    </select>
    `
})
export class DropDownEditorRender implements ICellEditorAngularComp {
    private drowdownIems: any;
    @ViewChild('dropdownSelector') public dropdownSelector;
    agInit(params): void {
      this.drowdownIems = params.values;
    }

    getValue(): any {
        let elem = this.drowdownIems.find(item => item.id == this.dropdownSelector.nativeElement.value);
        return elem.name;
    }
}