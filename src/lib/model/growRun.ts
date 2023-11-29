import { resourcesList } from '$lib/data/stores';
import type Experiment from '$lib/model/experiment';
import type { ResourceUsage } from '$lib/model/resource';

export type GrowRunConstructorType = {
	id: string;
	name: string;
	fromExperiment: Experiment | null;
	resources: { used?: ResourceUsage[]; required?: ResourceUsage[] };
	harvests?: Harvest[];
};

export type Harvest = {
	numberOfLeaves: number;
	massOfLeaves: number;
	qualityNotes?: string;
};

export default class GrowRun {
	id: string;
	name: string;
	fromExperiment: Experiment | null;

	resources: { used?: ResourceUsage[] | undefined; required?: ResourceUsage[] | undefined };
	harvests: Harvest[];

	constructor({ id, name, fromExperiment = null, resources, harvests }: GrowRunConstructorType) {
		this.id = id;
		this.name = name;
		this.fromExperiment = fromExperiment;
		this.resources = resources || { used: [], required: [] };
		this.harvests = harvests || [];
	}

	addResourceUsage(resourceUsage: ResourceUsage) {
		this.resources.used?.push(resourceUsage);
	}

	recordHarvest(harvest: Harvest) {
		this.harvests.push(harvest);
	}

	totalNumLeavesHarvested(): number {
		return this.harvests.reduce((previous, curr) => previous + curr.numberOfLeaves, 0);
	}

	totalMassLeavesHarvested(): number {
		return this.harvests.reduce((previous, curr) => previous + curr.massOfLeaves, 0);
	}

	calculateCost(): number {
		let totalCost = 0;
		for (let { name, amountUsed } of this.resources?.used || []) {
			const resource = resourcesList.getResource(name);
			if (!resource) continue;
			let oneCost = resource.calculateCost(amountUsed) || 0;
			totalCost += oneCost;
		}

		return totalCost;
	}

	formatDataForPieChart(): { label: string; size: number; colour: string }[] {
		return (
			this.resources?.used?.map(({ name, amountUsed }) => {
				const resource = resourcesList.getResource(name);
				const resourceCost = resource.calculateCost(amountUsed);
				return { size: resourceCost, label: name, colour: resource.colour };
			}) || []
		);
	}
}
