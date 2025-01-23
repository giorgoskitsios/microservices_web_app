import { authMiddleware, BadRequestError } from '@saas2024-23/common';
import { NextFunction, Request, Response, Router } from 'express';
import Solution from '../models/problem';

const router = Router();

router.get(
    '/',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const problems = await Solution.find({ userId });
            res.status(200).json(problems);
        } catch (error) {
            next(error);
        }
    }
);

//router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
//  try {
//    const problems = await Solution.find();
//    res.status(200).json(problems);
//  } catch (error) {
//    next(error);
//  }
//});

export { router as viewSolutionsRouter };
