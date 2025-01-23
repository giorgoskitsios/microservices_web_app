import { BasePublisher, UserCreatedEvent } from '@saas2024-23/common';

export class CreateUserPublisher extends BasePublisher<UserCreatedEvent> {
  exchangeName: 'user_create' = 'user_create';
}
