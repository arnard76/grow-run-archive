import { resourcesList } from '$lib/grow-run/stores';
import type { ResourceUsage } from './resource-usage/resourceUsage';
import type Conditions from '$lib/grow-run/conditions/conditions';
import type { Duration } from './details/duration/types';
import type { Harvest } from './harvest/types';

export type GrowRunConstructorType = {
	id: string;
	name: string;
	duration?: Duration;

	resources: { used?: ResourceUsage[]; required?: ResourceUsage[] };
	harvests?: Harvest[];
	conditions?: Conditions;
};

export default class GrowRun {
	id: string;
	name: string;
	duration: Duration;

	resources: { used?: ResourceUsage[] | undefined; required?: ResourceUsage[] | undefined };
	harvests: Harvest[];
	conditions: Conditions;

	constructor({ id, name, resources, harvests, conditions, duration }: GrowRunConstructorType) {
		this.id = id;
		this.name = name;
		this.resources = resources || { used: [], required: [] };
		this.harvests = harvests || [];
		this.conditions = conditions || {};
		this.duration = duration || { start: '-', end: '-' };
	}

	addResourceUsage(resourceUsage: ResourceUsage) {
		this.resources.used?.push(resourceUsage);
	}

	editResourceUsage(previousResourceName: ResourceUsage['name'], resourceUsage: ResourceUsage) {
		let index = this.resources.used?.findIndex((resource) => resource.name == previousResourceName);

		if (index == undefined || index === -1) return;

		(this.resources.used as ResourceUsage[])[index] = resourceUsage;
	}

	deleteResourceUsage(resourceName: ResourceUsage['name']) {
		let index = this.resources.used?.findIndex((resource) => resource.name == resourceName);
		if (index == undefined || index === -1) return;

		this.resources.used?.splice(index, 1);
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

	calculateDurationInMS(): number {
		const start = this.duration?.start;
		const end = this.duration?.end;
		if (!start || !end) return NaN;

		const startDate = new Date(start);
		const endDate = new Date(end);
		return endDate.getTime() - startDate.getTime();
	}

	calculateDurationInHours(): number {
		const ms = this.calculateDurationInMS();
		return ms / (1000 * 60 * 60);
	}

	calculateDurationInDays(): number {
		return this.calculateDurationInHours() / 24;
	}
}
