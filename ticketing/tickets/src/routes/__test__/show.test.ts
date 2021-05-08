import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';

it('Return a 404 if a ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  
     await request(app).
     get(`/api/tickets/${id}`).
     send().
     expect(404);
});

it('Return a ticket if a ticket is found', async () => {
  const title = 'test';
  const price = 20;
  
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title, price
  })
  .expect(201);
  const ticketResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()
  .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});