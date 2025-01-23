import amqp, { Connection } from 'amqplib';
import { CreateProblemPublisher } from '../rabbitmq/create-problem-publisher';
import { CreateUserListener } from '../rabbitmq/create-user-listener';
import { CreateBalanceListener } from '../rabbitmq/create-balance-listener';

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

let createProblemPublisher: CreateProblemPublisher | null = null;
let createUserListener: CreateUserListener | null = null;
let createBalanceListener: CreateBalanceListener | null = null;

export async function initRabbitMQ(url: string): Promise<void> {
  try {
    const connection = await connectRabbitMQ(url);
    createProblemPublisher = new CreateProblemPublisher(connection);
    createUserListener = new CreateUserListener(connection);
    createBalanceListener = new CreateBalanceListener(connection);
    console.log('RabbitMQ publishers and listeners initialized');
  } catch (error) {
    console.error('Failed to initialize RabbitMQ components:', error);
    throw error;
  }
}

export function getCreateProblemPublisher() {
  if (!createProblemPublisher) {
    throw new Error('CreateProblemPublisher not initialized');
  }
  return createProblemPublisher;
}

export function getCreateUserListener() {
  if (!createUserListener) {
    throw new Error('CreateUserListener not initialized');
  }
  return createUserListener;
}

export function getCreateBalanceListener() {
  if (!createBalanceListener) {
    throw new Error('CreateBalanceListener not initialized');
  }
  return createBalanceListener;
}
