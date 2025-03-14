import { ConditionsMeasurements } from './condition';
import { Duration } from './duration';
import { ActionNames } from './entity/actionNames';
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

class GrowRunActionNames extends ActionNames {
	constructor() {
		super('Grow Run');
	}

	get changeStartAndEnd() {
		return `Change Grow Run Start & End Dates`;
	}

	get changeName() {
		return 'Change Grow Run Name';
	}
}

export const growRunActionNames = new GrowRunActionNames();
