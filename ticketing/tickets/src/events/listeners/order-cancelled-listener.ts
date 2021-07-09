import { Listener ,NotFoundError,OrderCancelledEvent, Subjects } from "@itay_tix/common/build/index";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import {queueGroupName} from './queue-group-name';
import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  
  async onMessage(data : OrderCancelledEvent['data'], msg : Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    
    ticket.set({orderId: undefined});
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title:  ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    orderId: ticket.orderId,
    });
  
    msg.ack();
  }
}