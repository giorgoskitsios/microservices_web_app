import {
  AuthError,
  authMiddleware,
  BadRequestError,
  GeneralServerError,
  NotExistError,
} from '@saas2024-23/common';
import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import Balance from '../models/balance';
import { getCreateProblemPublisher } from '../utils/init-rabbitmq';
import { prepareLocationsData } from '../utils/prepare-locations-data';
import { v4 as uuid4 } from 'uuid';
import MetaData from '../models/metadata';

const upload = multer({ dest: 'uploads/' });

const router = Router();
const PROBLEM_PRICE = 2;

interface RequestBody {
  fileId: string;
  num_vehicles: number;
  depot: number;
  max_distance: number;
}

router.post(
  '/problem',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId!;
    const { fileId, max_distance, num_vehicles, depot } =
      req.body as RequestBody;
    try {
      if (
        fileId === undefined ||
        max_distance === undefined ||
        num_vehicles === undefined ||
        depot === undefined
      ) {
        throw new BadRequestError('All fields are required');
      }

      let fileMetaData = await MetaData.findById(fileId);
      if (!fileMetaData) {
        throw new NotExistError('Dataset not found');
      }
      if (fileMetaData.userId !== userId) {
        throw new AuthError('You have not permission to access this file');
      }

      let balance = await Balance.findOne({ userId });
      if (!balance) {
        throw new NotExistError('Balance not found');
      }
      if (balance.credits < PROBLEM_PRICE) {
        throw new BadRequestError('Not enough credits in account');
      }
      balance.credits -= PROBLEM_PRICE;
      await balance.save();

      const locations = prepareLocationsData(fileMetaData.filename);

      await getCreateProblemPublisher().publish({
        submitId: uuid4(),
        userId: userId,
        name: 'vrp',
        price: PROBLEM_PRICE,
        locations,
        depot,
        maxDistance: max_distance,
        numVehicles: num_vehicles,
      });

      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }
);

export { router as submitProblemRouter };
