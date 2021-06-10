import mongoose, { Mongoose } from 'mongoose';
import {OrderStatus} from '@itay_tix/common/build/index';
import {TicketDoc} from './ticket';

export {OrderStatus};

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(atter: OrderAttrs) : OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },

},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  });

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs); 
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };