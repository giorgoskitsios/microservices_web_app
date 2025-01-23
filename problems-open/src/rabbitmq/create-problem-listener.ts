import { BaseListener, ProblemCreatedEvent, GeneralServerError } from '@saas2024-23/common';
import { ConsumeMessage } from 'amqplib';
import Problem from '../models/problem';

export class CreateProblemListener extends BaseListener<ProblemCreatedEvent> {
    exchangeName: 'problem_create' = 'problem_create';
    queueName = 'problems_open:problem_create';
    async onMessage(data: ProblemCreatedEvent['data'], msg: ConsumeMessage) {
        try {
            const newProblem = new Problem({
                submitId: data.submitId,
                userId: data.userId,
                name: data.name,
                price: data.price,
                locations: data.locations,
                numVehicles: data.numVehicles,
                depot: data.depot,
                maxDistance: data.maxDistance
            });

            await newProblem.save();

            console.log(`Problem created for user ${data.userId}`);

            this.consumeChannel?.ack(msg);
        } catch (err) {
            const error = new GeneralServerError("Failed to create problem");
            console.error(error);
            // You might want to implement a retry mechanism or dead-letter queue here
            // For now, we'll just acknowledge the message to prevent it from being requeued indefinitely
            this.consumeChannel?.ack(msg);
        }
    }
}

