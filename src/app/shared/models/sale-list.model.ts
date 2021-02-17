import { ISerializable } from '../../core/serialization/iserializable';

export class SaleList implements ISerializable<SaleList> {
  salePriceId: number;
  brandItem: boolean;
  description: string;
  createOn: Date;
  name: string;
  percentage: number;

  deserialize(input: any): SaleList {
    Object.assign(this, input);
    return this;
  }
}
