import express, { Request, Response } from 'express';
import { Balance } from '../models/balance';
import { authMiddleware } from '@saas2024-23/common';

const router = express.Router();

router.get('/api/balance',
  authMiddleware, 
  async (req: Request, res: Response) => {
  const { userId } = req.user!;
  const balance = await Balance.findOne({userId});

  if (!balance) {
    throw new Error('Balance document not found');
  }

  res.send(balance);
});

export { router as showBalanceRouter };
