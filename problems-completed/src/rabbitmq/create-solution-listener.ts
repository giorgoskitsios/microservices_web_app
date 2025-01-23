import {
  BaseListener,
  SoluctionCreatedEvent,
  GeneralServerError,
} from '@saas2024-23/common';
import { ConsumeMessage } from 'amqplib';
import Solution from '../models/problem';

export class CreateSolutionListener extends BaseListener<SoluctionCreatedEvent> {
  exchangeName: 'solution_create' = 'solution_create';
  queueName = 'problems_completed:solution_create';
  async onMessage(data: SoluctionCreatedEvent['data'], msg: ConsumeMessage) {
    try {
      const newProblem = new Solution({
        submitId: data.submit_id,
        hasSolution: data.has_solution,
        solution: data.solution
          ? {
              maxDistance: data.solution.max_distance,
              objective: data.solution.objective,
              vehicles: data.solution.vehicles,
            }
          : null,
        duration: data.duration,
        userId: data.user_id,
      });

      await newProblem.save();

      console.log(`Solved problem created with submitId ${data.submit_id}`);

      this.consumeChannel?.ack(msg);
    } catch (err) {
      const error = new GeneralServerError('Failed to create problem');
      console.error(error);
      this.consumeChannel?.nack(msg);
    }
  }
}
