import { ISerializable } from '../../core/serialization/iserializable';

export class PointOfSaleModel implements ISerializable<PointOfSaleModel> {
  pointOfSaleId: number;
  name: string;
  hasCashRegister: boolean = false;

  deserialize(input: any): PointOfSaleModel {
    Object.assign(this, input);

    return this;
  }
}
