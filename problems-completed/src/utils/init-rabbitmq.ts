import amqp, { Connection } from 'amqplib';
import { CreateSolutionListener } from '../rabbitmq/create-solution-listener';

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

let createSolverListener: CreateSolutionListener | null = null;

export async function initRabbitMQ(url: string): Promise<void> {
  try {
    const connection = await connectRabbitMQ(url);
    createSolverListener = new CreateSolutionListener(connection);
    console.log('RabbitMQ publishers and listeners initialized');
  } catch (error) {
    console.error('Failed to initialize RabbitMQ components:', error);
    throw error;
  }
}

export function getCreateSolverListener() {
  if (!createSolverListener) {
    throw new Error('CreateProblemListener not initialized');
  }
  return createSolverListener;
}
