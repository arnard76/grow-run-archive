import { ConditionsMeasurements } from './environment/condition.js';
import { Duration } from '../duration.js';
import { ActionNames } from '../entity/actions.js';
import { Harvest } from './harvest.js';
import { ResourceUsage } from './resourceUsage.js';
import { Location } from './location.js';

export type GrowRun = {
	id: string;
	name: string;
	location?: Location;
	duration?: Duration;

	resources: { used?: ResourceUsage[]; required?: ResourceUsage[] };
	conditions?: ConditionsMeasurements;
	harvests?: Harvest[];
};

class GrowRunActionNames extends ActionNames {
	constructor() {
		super('Grow Run');
	}

	changeStartAndEnd = `Change Grow Run Start & End Dates`;
	changeName = 'Change Grow Run Name';
	addLocation = 'Add Grow Run Location';
}

export const growRunActionNames = new GrowRunActionNames();
export * as growRunEnvironment from './environment/index.js';
