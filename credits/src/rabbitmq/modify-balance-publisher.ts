import { BasePublisher, BalanceModifiedEvent } from '@saas2024-23/common';

export class ModifyBalancePublisher extends BasePublisher<BalanceModifiedEvent> {
  exchangeName: 'balance-modify' = 'balance-modify';
}