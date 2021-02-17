import { ISerializable } from '../../core/serialization/iserializable';

export class MinimumsItem implements ISerializable<MinimumsItem> {
  brandName: string;
  productDefinitionName: number;
  sizeName: string;
  colorName: string;
  minimumsByStoreName:Map<string,number>

  deserialize(input: any): MinimumsItem {
    Object.assign(this, input);
    if(input.minimumsByStoreName){
      let minimums = input.minimumsByStoreName;  
      this.minimumsByStoreName = new Map<string,number>();
      for (var value in minimums) {  
        this.minimumsByStoreName.set(value,minimums[value]);  
      } 
    }
    return this;
  }
}
