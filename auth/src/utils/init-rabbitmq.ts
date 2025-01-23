import amqp, { Connection } from 'amqplib';
import { CreateUserPublisher } from '../rabbitmq/create-user-publisher';

let connection: Connection | null = null;
async function connectRabbitMQ(url: string): Promise<Connection> {
  if (!connection) {
    try {
      connection = await amqp.connect(url);
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }
  return connection;
}

let createUserPublisher: CreateUserPublisher | null = null;

export async function initRabbitMQ(url: string): Promise<void> {
  try {
    const connection: Connection = await connectRabbitMQ(url);
    createUserPublisher = new CreateUserPublisher(connection);
    console.log('RabbitMQ publishers and listeners initialized');
  } catch (error) {
    console.error('Failed to initialize RabbitMQ components:', error);
    throw error;
  }
}

export function getUserCreatedPublisher(): CreateUserPublisher {
  if (!createUserPublisher) {
    throw new Error('UserCreatedPublisher is not initialized');
  }
  return createUserPublisher;
}
