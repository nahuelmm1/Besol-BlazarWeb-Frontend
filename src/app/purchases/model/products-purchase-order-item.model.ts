import { ISerializable } from '../../core/serialization/iserializable';

export class ProductsPurchaseOrderItem implements ISerializable<ProductsPurchaseOrderItem> {
  code: string;
  article: string;
  colour: string;
  size: string;
  store: string;
  minStock: number;
  stock: number;
  sold: number;
  unitPrice: number;
  colourId: number;
  sizeId: number;
  storeId: number;
  quantity: number;

  deserialize(input: any): ProductsPurchaseOrderItem {
    Object.assign(this, input);
    this.quantity = 0;
    return this;
  }
}
