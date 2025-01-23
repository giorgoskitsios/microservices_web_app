import { Channel, Connection, ConsumeMessage } from 'amqplib';
import { Event } from './events';

export abstract class BaseListener<T extends Event> {
  protected consumeChannel: Channel | null = null;
  protected connection: Connection;
  abstract exchangeName: T['exchange'];
  abstract queueName: string;
  abstract onMessage(data: T['data'], msg: ConsumeMessage): void;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  private async createChannel(): Promise<Channel> {
    if (!this.consumeChannel) {
      this.consumeChannel = await this.connection.createChannel();
    }
    return this.consumeChannel;
  }

  async listen(): Promise<void> {
    try {
      const channel = await this.createChannel();
      await channel.assertExchange(this.exchangeName, 'fanout', {
        durable: true,
      });
      await channel.assertQueue(this.queueName, { durable: true });
      await channel.bindQueue(this.queueName, this.exchangeName, '');
      channel.consume(
        this.queueName,
        (msg) => {
          if (msg !== null) {
            let data = msg.content.toString();
            let jsonData: T['data'] = JSON.parse(data);
            this.onMessage(jsonData, msg);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async closeChannel(): Promise<void> {
    await this.consumeChannel?.close();
    console.log('Consume channel closed');
  }
}
