import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors';

async function errorMiddleware(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred.',
    });
  }
}

export { errorMiddleware };
