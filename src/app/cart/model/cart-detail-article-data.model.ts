import { ISerializable } from '../../core/serialization/iserializable';
import { environment } from '../../../environments/environment';

export class CartDetailArticleDataModel implements ISerializable<CartDetailArticleDataModel> {
  productDefinitionId: number;
  sizes: any;
  colors: any;
  imageUrl: string;
  optionText: string;

  deserialize(input: any): CartDetailArticleDataModel {
    Object.assign(this, input);

    if (input.imageUrl) {
      this.imageUrl = environment.PRODUCT_IMAGE_PATH + input.imageUrl;
    }

    return this;
  }
}
