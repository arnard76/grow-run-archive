import { ConditionsMeasurements } from './condition';
import { Duration } from './duration';
import { Harvest } from './harvest';
import { ResourceUsage } from './resourceUsage';

export type GrowRun = {
	id: string;
	name: string;
	duration?: Duration;

	resources: { used?: ResourceUsage[]; required?: ResourceUsage[] };
	harvests?: Harvest[];
	conditions?: ConditionsMeasurements;
};
