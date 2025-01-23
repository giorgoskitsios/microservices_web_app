import mongoose from 'mongoose';
import { app } from './app';
import { checkEnvVariables } from './utils/env-check';
import {
  getUserCreatedListener,
  getProblemCreatedListener,
  initRabbitMQ,
} from './utils/init-rabbitmq';

const PORT = process.env.PORT;
const MONGO_DB_URI = `${process.env.MONGO_DB_URI}`!;
const RABBITMQ_URL: string = process.env.NODE_ENV === 'production'
    ? process.env.RABBITMQ_URL_PROD!
    : process.env.RABBITMQ_URL_DEV!;

async function run() {
  try {
    checkEnvVariables();
    await initRabbitMQ(RABBITMQ_URL);
    await getUserCreatedListener().listen();
    await getProblemCreatedListener().listen();
    await mongoose.connect(MONGO_DB_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

run();
