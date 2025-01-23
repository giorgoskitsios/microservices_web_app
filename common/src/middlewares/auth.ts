import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../errors';

interface UserPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error('Authorization token missing');
    }
    const decoded = jwt.verify(token, JWT_SECRET!) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthError('Not Authorized'));
  }
}

export { verifyToken as authMiddleware };
