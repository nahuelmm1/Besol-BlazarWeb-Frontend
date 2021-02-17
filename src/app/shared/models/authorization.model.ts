import { ISerializable } from '../../core/serialization/iserializable';

export class Authorization implements ISerializable<Authorization> {
  canDeleteReceipt: boolean;
  canOpenCashRegister: boolean;
  isCartAdmin: boolean;

  deserialize(input: any): Authorization {
    Object.assign(this, input);
    return this;
  }
}
