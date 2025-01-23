import {
  BaseListener,
  GeneralServerError,
  ProblemCreatedEvent,
} from '@saas2024-23/common';
import { ConsumeMessage } from 'amqplib';
import { Balance } from '../models/balance';

export class CreateProblemListener extends BaseListener<ProblemCreatedEvent> {
  exchangeName: 'problem_create' = 'problem_create';
  queueName = 'credits:problem_create';
  async onMessage(data: ProblemCreatedEvent['data'], msg: ConsumeMessage) {
    try {
      const balance = await Balance.findOne({ userId: data.userId });
      if (!balance) {
        console.error(`Balance not found for userId: ${data.userId}`);
        throw new Error('Balance not found');
      }

      console.log(`User balance found: ${balance.amount}`);

      const newAmount = balance.amount - data.price;

      if (newAmount < 0) {
        console.log(
          `Insufficient balance for user ${data.userId}. Current balance: ${balance.amount}, Attempted price: ${data.price}`
        );
        this.consumeChannel?.ack(msg);
        return;
      }

      balance.set({
        amount: newAmount,
      });

      await balance.save();

      this.consumeChannel?.ack(msg);
      console.log('Balance updated and saved successfully');
    } catch (err) {
      console.error(err);
      this.consumeChannel?.nack(msg);
    }
  }
}
