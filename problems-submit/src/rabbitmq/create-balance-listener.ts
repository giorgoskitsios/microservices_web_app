import { BaseListener, GeneralServerError, BalanceModifiedEvent } from '@saas2024-23/common';
import Balance from '../models/balance';
import { ConsumeMessage } from 'amqplib';

export class CreateBalanceListener extends BaseListener<BalanceModifiedEvent> {
    exchangeName: 'balance-modify' = 'balance-modify';
    queueName = 'problems_submit:balance-modify';
    async onMessage(data: BalanceModifiedEvent['data'], msg: ConsumeMessage) {
        try {
            const balance = await Balance.findOne({ userId: data.userId });
            if (!balance) {
                console.error(`Balance not found for userId: ${data.userId}`);
                throw new Error('Balance not found');
            }
            console.log(`User balance found: ${balance.credits}`);
            balance.credits += data.amount;
            await balance.save();
            this.consumeChannel?.ack(msg);
        } catch (error) {
            console.error('Error processing balance update:', error);
            throw new GeneralServerError('Failed to process balance update');
        }
    }
}


