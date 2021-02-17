import { ISerializable } from '../../core/serialization/iserializable';
import { CartStateModel } from './cart-state.model';

export class CartDetailAuthModel implements ISerializable<CartDetailAuthModel> {
  allowedStates: boolean;

  deserialize(input: any): CartDetailAuthModel {
    Object.assign(this, input);

    if (input.allowedStates) {
      this.allowedStates = input.allowedStates.map(
        (state) => {
          const allowedState = new CartStateModel();
          allowedState.deserialize(state);
          return allowedState;
        }
      );
    }
    return this;
  }
}
