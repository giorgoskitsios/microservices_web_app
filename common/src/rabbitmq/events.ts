export interface Event {
  exchange: string;
  data: any;
}

export interface UserCreatedEvent {
  exchange: 'user_create';
  data: { userId: string };
}

export interface ProblemCreatedEvent {
  exchange: 'problem_create';
  data: {
    submitId: string;
    userId: string;
    name: string;
    price: number;
    locations: {
      latitude: number;
      longitude: number;
    }[];
    numVehicles: number;
    depot: number;
    maxDistance: number;
  };
}

export interface BalanceModifiedEvent {
  exchange: 'balance-modify';
  data: {
    userId: string;
    amount: number;
  };
}

export interface SoluctionCreatedEvent {
  exchange: 'solution_create';
  data: {
    solution: {
      objective: string;
      max_distance: number;
      vehicles: {
        plan: number[];
        dist: number;
      }[];
    };
    duration: number;
    has_solution: boolean;
    submit_id: string;
    user_id: string;
  };
}
