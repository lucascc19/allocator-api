export interface Demand {
  id: number;
  name: string;
  hours: number;
}

export interface Developer {
  id: number;
  name: string;
  hoursAvailable: number;
}

export interface Allocation {
  developer: Developer;
  allocatedDemands: Demand[];
  remainingHours: number;
}
