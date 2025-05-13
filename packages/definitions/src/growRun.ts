import { ConditionsMeasurements } from './condition';
import { Duration } from './duration';
import { ActionNames } from './entity/actions';
import { Harvest } from './harvest';
import { ResourceUsage } from './resourceUsage';
import { Location } from './location';

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
