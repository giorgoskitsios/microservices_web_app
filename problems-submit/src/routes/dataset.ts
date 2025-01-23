import { authMiddleware } from '@saas2024-23/common';
import { Router, Request, Response, NextFunction } from 'express';
import MetaData from '../models/metadata';

const router = Router();

router.get(
  '/datasets',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metaData = await MetaData.find({ userId: req.user?.userId });
      res.status(200).json({ datasets: metaData });
    } catch (error) {
      next(error);
    }
  }
);

export { router as getDatasetsRouter };
