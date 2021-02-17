import { ISerializable } from '../../core/serialization/iserializable';

export class CartDetailArticleModel implements ISerializable<CartDetailArticleModel> {
  cartNumber: number;
  productDefinitionId: number;
  sizeId: number;
  colorId: number;
  brand: string;
  article: string;
  color: string;
  size: string;
  unitPrice: number;

  deserialize(input: any): CartDetailArticleModel {
    Object.assign(this, input);

    return this;
  }
}
