import { Component, OnInit, ViewChild, ElementRef, Renderer, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ms-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  isOpen: boolean;

  @ViewChild('input')
  input: ElementRef;

  //@Output() searchEvent: Observable<any> = new EventEmitter<string>();
  //search = new FormControl();

  constructor(public renderer: Renderer) { }

  ngOnInit() {
    // this.search.valueChanges
    //   .debounceTime(500)
    //   .distinctUntilChanged()
    //   .subscribe(inputValue => this.searchEvent.emit(inputValue));
  }

  open() {
    this.isOpen = true;

    setTimeout(() => {
      this.renderer.invokeElementMethod(
        this.input.nativeElement, 'focus', []);
    }, 100);

  }

  close() {
    this.isOpen = false;
  }

}
