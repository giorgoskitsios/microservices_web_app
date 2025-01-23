import { Channel, Connection } from 'amqplib';
import { Event } from './events';

export abstract class BasePublisher<T extends Event> {
  protected connection: Connection;
  private publishChannel: Channel | null = null;
  abstract exchangeName: T['exchange'];

  constructor(connection: Connection) {
    if (!connection) {
      throw new Error('Connection is required');
    }
    this.connection = connection;
  }

  private async createChannel(): Promise<Channel> {
    if (!this.publishChannel) {
      this.publishChannel = await this.connection.createChannel();
    }
    return this.publishChannel;
  }

  public async publish(data: T['data']): Promise<void> {
    try {
      const channel = await this.createChannel();
      await channel.assertExchange(this.exchangeName, 'fanout', {
        durable: true,
      });
      const msg = JSON.stringify(data);
      const success = channel.publish(this.exchangeName, '', Buffer.from(msg), {
        persistent: true,
      });

      if (!success) {
        throw new Error('Message could not be published to the queue');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (this.publishChannel) {
      await this.publishChannel.close();
      this.publishChannel = null;
      console.log('Publisher channel closed');
    }
  }
}
