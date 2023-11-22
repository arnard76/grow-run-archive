import type Experiment from '$lib/model/experiment';
import type { ResourceUsage } from '$lib/model/resource';

export default class GrowRun {
	name: string;
	fromExperiment: Experiment | null;
	resources: { used: ResourceUsage[]; required?: ResourceUsage[] };

	constructor(
		name: string,
		fromExperiment: Experiment | null = null,
		resources: { used: ResourceUsage[]; required?: ResourceUsage[] }
	) {
		this.name = name;
		this.fromExperiment = fromExperiment;
		this.resources = resources;
	}

	calculateCost(): number {
		let totalCost = 0;
		for (let resource of this.resources.used) {
			let oneCost = resource.resource.calculateCost(resource.amountUsed);
			totalCost += oneCost;
		}

		return totalCost;
	}
}
