import amqp, { Connection } from 'amqplib';
import { CreateUserListener } from '../rabbitmq/create-user-listener';
import { CreateProblemListener } from '../rabbitmq/create-problem-listener';
import { ModifyBalancePublisher } from '../rabbitmq/modify-balance-publisher';

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

let createUserListener: CreateUserListener | null = null;
let createProblemListener: CreateProblemListener | null = null;
let modifyBalancePublisher: ModifyBalancePublisher | null = null;

export async function initRabbitMQ(url: string): Promise<void> {
  try {
    const connection = await connectRabbitMQ(url);
    createUserListener = new CreateUserListener(connection);
    createProblemListener = new CreateProblemListener(connection);
    modifyBalancePublisher = new ModifyBalancePublisher(connection);
    console.log('RabbitMQ publishers and listeners initialized');
  } catch (error) {
    console.error('Failed to initialize RabbitMQ components:', error);
    throw error;
  }
}

export function getUserCreatedListener(): CreateUserListener {
  if (!createUserListener) {
    throw new Error('UserCreatedPublisher is not initialized');
  }
  return createUserListener;
}

export function getProblemCreatedListener(): CreateProblemListener {
  if (!createProblemListener) {
    throw new Error('ProblemCreatedPublisher is not initialized');
  }
  return createProblemListener;
}

export function getModifyBalancePublisher() {
  if (!modifyBalancePublisher) {
    throw new Error('ModifyBalancePublisher not initialized');
  }
  return modifyBalancePublisher;
}
