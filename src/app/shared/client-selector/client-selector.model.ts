import { ISerializable } from '../../core/serialization/iserializable';

export class ClientSelectorModel implements ISerializable<ClientSelectorModel> {
  clientNumber: number;
  name: string;
  lastname: string;
  email: number;
  province: string;

  deserialize(input: any): ClientSelectorModel {
    Object.assign(this, input);
    return this;
  }
}
