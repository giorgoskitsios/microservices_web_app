import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { errorMiddleware } from '@saas2024-23/common';
import { viewSolutionsRouter } from './routes/view';
import { statisticsRouter } from './routes/statistics';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/completed/', viewSolutionsRouter);
app.use('/api/statistics', statisticsRouter);

app.use(errorMiddleware);

export default app;
