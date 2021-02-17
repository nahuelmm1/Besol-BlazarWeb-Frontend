import { Component, Input, OnInit } from '@angular/core';
import { CartStateModel } from '../../model/cart-state.model';
import { CartService } from '../../service/cart.service';

const CANCELED_STATE = 7;
@Component({
    moduleId: module.id,
    selector: 'bla-cart-state-breadcrumb',
    templateUrl: 'cart-state-breadcrumb.component.html'
  })
  export class CartStateBreadcrumbComponent implements OnInit {
    @Input() stateId: number;
    states: Array<CartStateModel> = [];
    canceledState: CartStateModel;
    ready = false;

    constructor(
      private cartService: CartService,
    ) { }

    ngOnInit(): void {
      this.initStates();
    }

    initStates(): void {
      this.cartService.getStates()
        .subscribe((states: Array<CartStateModel>) => {
          this.states = states.filter((state) => {
            if (state.stateId === CANCELED_STATE) {
              this.canceledState = state;
              return false;
            }
            return true;
          });
          this.ready = true;
        });
    }

    isCanceled(): boolean {
      return this.stateId === CANCELED_STATE;
    }
  }
