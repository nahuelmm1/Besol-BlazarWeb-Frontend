import { ISerializable } from '../../core/serialization/iserializable';

export class CashRegisterStateModel implements ISerializable<CashRegisterStateModel> {
  isOpened: boolean;

  deserialize(input: any): CashRegisterStateModel {
    Object.assign(this, input);

    return this;
  }
}
