import { Allocation, Demand, Developer } from "../utils/interfaces";

export const allocateDemandsToDevelopers = (
  demands: Demand[],
  developers: Developer[]
): Allocation[] => {
  const sortedDemands = demands.sort((a, b) => b.hours - a.hours);

  const allocation: Allocation[] = developers.map((dev) => ({
    developer: dev,
    allocatedDemands: [],
    remainingHours: dev.hoursAvailable,
  }));

  sortedDemands.forEach((demand) => {
    allocation.sort((a, b) => b.remainingHours - a.remainingHours);

    let allocated = false;

    for (let i = 0; i < allocation.length; i++) {
      if (allocation[i].remainingHours >= demand.hours) {
        allocation[i].allocatedDemands.push(demand);
        allocation[i].remainingHours -= demand.hours;
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      distributeRemainingHours(demand, allocation);
    }
  });

  return allocation;
};

const distributeRemainingHours = (demand: Demand, allocation: Allocation[]) => {
  allocation.sort((a, b) => b.remainingHours - a.remainingHours);

  let remainingHoursToAllocate = demand.hours;

  for (let i = 0; i < allocation.length && remainingHoursToAllocate > 0; i++) {
    const devAllocation = allocation[i];

    if (devAllocation.remainingHours > 0) {
      const hoursToAllocate = Math.min(
        devAllocation.remainingHours,
        remainingHoursToAllocate
      );

      devAllocation.allocatedDemands.push({
        ...demand,
        hours: hoursToAllocate,
      });

      devAllocation.remainingHours -= hoursToAllocate;
      remainingHoursToAllocate -= hoursToAllocate;
    }
  }
};
