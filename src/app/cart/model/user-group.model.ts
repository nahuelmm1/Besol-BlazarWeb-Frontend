import { ISerializable } from '../../core/serialization/iserializable';

export class UserGroupModel implements ISerializable<UserGroupModel> {
    id: number;
    username: string;
    email: string;
    name: string;
    surname: string;

    deserialize(input: any): UserGroupModel {

        this.id = input.id;
        this.username = input.username;
        this.email = input.email;
        this.name = input.name;
        this.surname = input.surname;

        return this;
    }
}
