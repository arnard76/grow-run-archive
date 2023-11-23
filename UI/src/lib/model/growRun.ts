import { getResource } from '$lib/data/stores';
import type Experiment from '$lib/model/experiment';
import type { ResourceUsage } from '$lib/model/resource';

export type GrowRunType = {
	id: string;
	name: string;
	fromExperiment: Experiment | null;
	resources: { used?: ResourceUsage[]; required?: ResourceUsage[] };
};

export default class GrowRun {
	id: string;
	name: string;
	fromExperiment: Experiment | null;
	resources: { used?: ResourceUsage[] | undefined; required?: ResourceUsage[] | undefined };

	constructor({ id, name, fromExperiment = null, resources }: GrowRunType) {
		this.id = id;
		this.name = name;
		this.fromExperiment = fromExperiment;
		this.resources = resources || { used: [], required: [] };
	}

	addResourceUsage(resourceUsage: ResourceUsage) {
		this.resources.used?.push(resourceUsage);
	}

	calculateCost(): number {
		let totalCost = 0;
		for (let { name, amountUsed } of this.resources?.used || []) {
			const resource = getResource(name);
			if (!resource) continue;
			let oneCost = resource.calculateCost(amountUsed) || 0;
			totalCost += oneCost;
		}

		return totalCost;
	}
}
