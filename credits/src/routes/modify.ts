import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { Balance } from '../models/balance';
import {
  authMiddleware,
  BadRequestError,
  GeneralServerError,
} from '@saas2024-23/common';
import { getModifyBalancePublisher } from '../utils/init-rabbitmq';

const router = express.Router();

router.post(
  '/api/balance',
  authMiddleware,
  [body('amount').isFloat().withMessage('Amount to add must be provided')],
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user!;
    const { amount } = req.body;

    try {
      const balance = await Balance.findOne({ userId });

      if (!balance) {
        throw new GeneralServerError('Balance not found');
      }

      const newAmount = balance.amount + amount;

      if (newAmount < 0) {
        throw new BadRequestError('Amount must be positive');
      }

      balance.set({
        userId: userId,
        amount: newAmount,
      });

      await balance.save();

      res.status(201).json(balance);

      await getModifyBalancePublisher().publish({
        userId: userId,
        amount: amount,
      });
      console.log('Credits amount added event published');
    } catch (error) {
      next(error);
    }
  }
);

export { router as modifyBalanceRouter };
