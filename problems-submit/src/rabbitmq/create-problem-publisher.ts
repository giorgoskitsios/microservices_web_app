import { BasePublisher, ProblemCreatedEvent } from '@saas2024-23/common';

export class CreateProblemPublisher extends BasePublisher<ProblemCreatedEvent> {
  exchangeName: 'problem_create' = 'problem_create';
}
