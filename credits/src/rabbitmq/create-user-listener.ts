import {
  BaseListener,
  GeneralServerError,
  UserCreatedEvent,
} from '@saas2024-23/common';
import { Balance } from '../models/balance';
import { ConsumeMessage } from 'amqplib';

export class CreateUserListener extends BaseListener<UserCreatedEvent> {
  exchangeName: 'user_create' = 'user_create';
  queueName = 'credits:user_create';
  async onMessage(data: UserCreatedEvent['data'], msg: ConsumeMessage) {
    try {
      let newBalance = new Balance({
        userId: data.userId,
        amount: 0,
      });
      await newBalance.save();
      this.consumeChannel?.ack(msg);
    } catch (err) {
      const error = new GeneralServerError("Failed to create user's balance");
      console.error(error);
    }
  }
}
