import { ISerializable } from '../../core/serialization/iserializable';

export class MenuItem implements ISerializable<MenuItem> {
  menuId: number;
  icon: string;
  languageKey: string;
  route: string;
  order: number;
  items: Array<MenuItem> = new Array<MenuItem>();
  // roles: Array<string>;

  deserialize(input: any): MenuItem {
    Object.assign(this, input);

    if (input.items) {
      this.items = input.items.map((item: any) => new MenuItem().deserialize(item));
    }

    return this;
  }
}
