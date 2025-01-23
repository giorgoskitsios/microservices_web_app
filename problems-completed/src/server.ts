import mongoose from 'mongoose';
import app from './app';
import { checkEnvVariables } from './utils/env-check';
import { getCreateSolverListener, initRabbitMQ } from './utils/init-rabbitmq';

const PORT = process.env.PORT || 5007;
const MONGO_DB_URI: string = process.env.MONGO_DB_URI!;
const RABBITMQ_URL: string = process.env.NODE_ENV === 'production'
    ? process.env.RABBITMQ_URL_PROD!
    : process.env.RABBITMQ_URL_DEV!;

async function run() {
    try {
        checkEnvVariables();
        await initRabbitMQ(RABBITMQ_URL);
        await mongoose.connect(MONGO_DB_URI);
        console.log('Connected to MongoDB');
        await getCreateSolverListener().listen();
        app.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

run();