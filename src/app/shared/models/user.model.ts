import { ISerializable } from '../../core/serialization/iserializable';
import { MenuItem } from './menu-item.model';
import { Authorization } from './authorization.model';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { SaleList } from './sale-list.model';
import { Suplier } from './suplier.model';

export class User implements ISerializable<User> {
  id: number;
  displayName: string;
  username: string;
  name: string;
  surname: string;
  password: string;
  businessName: string;
  menu: Array<MenuItem> = new Array<MenuItem>();
  routes: Array<string> = new Array<string>();
  supliers: Array<Suplier> = new Array<Suplier>();
  authorization: Authorization;
  email: string;
  dni: string;
  address: string;
  lastAccessDate: string;
  deliveryAddress: string;
  taxAddress: string;
  country: string;
  province: string;
  deliveryProvince: string;
  taxProvince: string;
  city: string;
  deliveryCity: string;
  taxCity: string;
  iva: string;
  cuit: string;
  cp: string;
  howToContact: string;
  expreso: string;
  saleList: SaleList;
  phone: string;
  mobilePhone: string;
  fax: string;
  isActive: boolean;
  isPenalized: boolean;
  isWoman: boolean;


  deserialize(input: any): User {
    Object.assign(this, input);

    if (input.lastAccessDate) {
      this.lastAccessDate = moment(input.lastAccessDate).format(environment.DATE_FORMAT);
    }

    if (input.saleList) {
      this.saleList =  new SaleList().deserialize(input.saleList);
    }

    if (input.supliers) {
      this.supliers =  this.supliers.map((suplierItem: any) => new Suplier().deserialize(suplierItem));
    }

    if (input.menu) {
      if (input.menu.items) {
        this.menu = input.menu.items.map((menuItem: any) => new MenuItem().deserialize(menuItem));
      }
      if (input.menu.routes) {
        this.routes = input.menu.routes.map((route: string) => route);
      }
    }

    return this;
  }
}
