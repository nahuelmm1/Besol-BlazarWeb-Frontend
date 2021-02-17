import { ISerializable } from "../../core/serialization/iserializable";

export class CartDetailProductModel
  implements ISerializable<CartDetailProductModel> {
  cartNumber: number;
  locked: boolean;
  productDefinitionId: number;
  sizeId: number;
  colorId: number;
  fromCart: string;
  added: boolean;
  rowNumber: number;
  confirmed: boolean;
  modified: boolean;
  stock: number;
  stockControl: number;
  stockCorner: number;
  stockSarmiento: number;
  quantity: number;
  brand: string;
  article: string;
  color: string;
  size: string;
  unitPrice: number;
  total: number;
  optionComment: string;
  selected: boolean;

  public static sortProducts(
    a: CartDetailProductModel,
    b: CartDetailProductModel
  ): number {
    if (a.locked === b.locked) {
    if (a.fromCart === b.fromCart) {
      if (a.confirmed === b.confirmed) {
        if((a.stock===0 && !a.confirmed)  || (b.stock===0 && !a.confirmed)){
          if(a.stock>b.stock)
            return 1;
          if(a.stock<b.stock)
            return -1;
          return 0;
        }
        // if(a.stock>0 && b.stock>0){
          if (a.brand > b.brand) {
            return 1;
          } else if (a.brand < b.brand) {
            return -1;
          } else {
            if (a.article > b.article) {
              return 1;
            } else if (a.article < b.article) {
              return -1;
            } else {
              return 0;
            }
          }          
        // }else{
        //   if(a.stock < b.stock)
        //     return -1;
        //   if(a.stock > b.stock )
        //     return 1;
        //   return 0;
        // }
      } else {
        if (a.confirmed) {
          return 1;
        } else {
          return -1;
        }
      }
    } else {
      if (a.fromCart > b.fromCart) {
        return 1;
      } else {
        return -1;
      }
    }
  }
  else {
    if (a.locked > b.locked) {
      return 1;
    }
    else {
      return -1;
    }
  }
  }

  deserialize(input: any): CartDetailProductModel {
    Object.assign(this, input);

    return this;
  }
}
