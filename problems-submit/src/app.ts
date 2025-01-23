import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { errorMiddleware } from '@saas2024-23/common';
import { submitProblemRouter } from './routes/problem';
import { uploadDatasetRouter } from './routes/upload';
import { getDatasetsRouter } from './routes/dataset';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', submitProblemRouter);
app.use('/api', uploadDatasetRouter);
app.use('/api', getDatasetsRouter);

app.use(errorMiddleware);

export default app;
