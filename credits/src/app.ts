import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
// import cookieSession from 'cookie-session';
import { modifyBalanceRouter } from './routes/modify';
import { showBalanceRouter } from './routes/show';
import { errorMiddleware } from '@saas2024-23/common';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(cors());

app.use(modifyBalanceRouter);
app.use(showBalanceRouter);

app.use(errorMiddleware);

export { app };
