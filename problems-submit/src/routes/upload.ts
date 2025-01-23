import { authMiddleware, BadRequestError } from '@saas2024-23/common';
import { NextFunction, Request, Response, Router } from 'express';
import upload from '../middlewares/multer';
import MetaData from '../models/metadata';
const router = Router();

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    try {
      if (!req.file) {
        throw new BadRequestError('No file provided');
      }
      const { filename, originalname } = req.file;
      const metaData = new MetaData({ filename, originalname, userId });
      await metaData.save();
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

export { router as uploadDatasetRouter };
