import { authMiddleware } from '@saas2024-23/common';
import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import User from '../models/user';
import { GoogleAuthClient } from '../utils/auth-client';
import { getUserCreatedPublisher } from '../utils/init-rabbitmq';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET!;

const authClient = new GoogleAuthClient(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

router.post(
  '/google',
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    try {
      const payload = await authClient.getPayload(token);
      const { sub: googleId, email } = payload;
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ googleId, email });
        await user.save();
        const userId = user._id as Types.ObjectId;
        let publisher = getUserCreatedPublisher();
        await publisher.publish({ userId: userId.toString() });
      }

      const jwtToken = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
        expiresIn: '1h',
      });
      res.status(200).json({ token: jwtToken });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/currentUser',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, userId } = req.user!;
      res.json({ email, userId });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let users = await User.find();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  }
);

export { router as authRouter };
