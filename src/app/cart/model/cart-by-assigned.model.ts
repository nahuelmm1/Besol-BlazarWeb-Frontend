import { ISerializable } from '../../core/serialization/iserializable';
import { environment } from '../../../environments/environment';
import { CartByStateItem } from './cart-by-state.model';
import * as moment from 'moment';

const CASH_ON_DELIVERY_PAYMENT_ID = 2;
const PAID_PAYMENT_ID = 1;
export class CartByAssignedItem extends CartByStateItem implements ISerializable<CartByAssignedItem> {

    stateName:string;
    stateId:number;
    isUserSanctioned:boolean;
    
    deserialize(input: any): CartByAssignedItem {    
        Object.assign(this, input);

        this.isPaid = this.paymentStateId === PAID_PAYMENT_ID;
        this.isCashOnDelivery = this.paymentStateId === CASH_ON_DELIVERY_PAYMENT_ID;
    
        if (input.registerDate) {
          this.registerDate = moment(input.registerDate).format(environment.SHORT_DATE_FORMAT);
        }
        if (input.stateDate) {
          this.stateDate = moment(input.stateDate).format(environment.SHORT_DATE_FORMAT);
        }
        if (input.adjustedDate) {
          this.adjustedDate = moment(input.adjustedDate).format(environment.SHORT_DATE_FORMAT);
        }
        return this;
    }
}
