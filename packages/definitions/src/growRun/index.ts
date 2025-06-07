import { ConditionsMeasurements } from './environment/condition.js';
import { Duration } from '../duration.js';
import { ActionNames } from '../entity/actions.js';
import { Harvest } from './harvest.js';
import { ResourceUsage } from './resourceUsage.js';
import { Location } from './location.js';
import dayjs from '@grow-run-archive/dayjs';
import Resource from '../resource.js';

export type GrowRunType = {
	id: string;
	name: string;
	location?: Location;
	duration?: Duration;

	resources: { used?: ResourceUsage[]; required?: ResourceUsage[] };
	conditions?: ConditionsMeasurements;
	harvests?: Harvest[];
};

export class GrowRun {
	id: GrowRunType['id'];
	name: GrowRunType['name'];
	duration: GrowRunType['duration'];
	location: GrowRunType['location'];

	resources: Required<GrowRunType>['resources'];
	harvests: Required<GrowRunType>['harvests'];
	conditions: Required<GrowRunType>['conditions'];

	constructor({ id, name, resources, harvests, conditions, duration, location }: GrowRunType) {
		this.id = id;
		this.name = name;
		this.resources = resources || { used: [], required: [] };
		this.harvests = harvests || [];
		this.conditions = conditions || {};
		this.duration = duration || {};
		this.location = location;
	}

	/**
	 * Active = grow run is in progress right now
	 */
	get active(): boolean {
		return !!(
			this.duration?.start && // GR has started and
			dayjs(this.duration.start).isBefore() && // GR started in the past and
			(!this.duration.end || dayjs(this.duration.end).isAfter()) // grow run hasn't ended yet
		);
	}

	addResourceUsage(resourceUsage: ResourceUsage) {
		this.resources.used?.push(resourceUsage);
	}

	editResourceUsage(
		previousResourceName: ResourceUsage['resourceName'],
		resourceUsage: ResourceUsage
	) {
		let index = this.resources.used?.findIndex(
			(resource) => resource.resourceName == previousResourceName
		);

		if (index == undefined || index === -1) return;

		(this.resources.used as ResourceUsage[])[index] = resourceUsage;
	}

	deleteResourceUsage(resourceName: ResourceUsage['resourceName']) {
		let index = this.resources.used?.findIndex((resource) => resource.resourceName == resourceName);
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

	calculateCost(resources: Resource[]): number {
		let totalCost = 0;
		for (let { resourceName, amountUsed } of this.resources?.used || []) {
			const resource = resources.find((resource: any) => resource.name === resourceName);
			if (!resource) continue;
			totalCost += resource.calculateCost(amountUsed) || 0;
		}

		return totalCost;
	}

	calculateCostPer100g(resources: Resource[]): number {
		return (this.calculateCost(resources) * 100) / this.totalMassLeavesHarvested();
	}

	calculateDurationInDays(): number {
		const start = this.duration?.start;
		const end = this.duration?.end || dayjs();
		if (!start) return NaN;

		return dayjs(end).diff(start, 'days', true);
	}

	// updateTemperatureRecord(medium){}

	// NOPPPPEEEEE: if the temperatures are measured after various time intervals,
	// then the average is skewed towards certain times of the day
	// e.g. when I am awake lol
	// calculateAverageTemperature(medium: 'air-temperature' | 'water-temperature') {
	// 	const temps = this.conditions[medium];
	// 	if (!temps) return;

	// 	return (
	// 		temps.reduce((prevTotal, currTemp) => prevTotal + currTemp.temperature, 0) / temps.length
	// 	);
	// }
}

class GrowRunActionNames extends ActionNames {
	constructor() {
		super('Grow Run');
	}

	changeStartAndEnd = `Change Grow Run Start & End Dates`;
	changeName = 'Change Grow Run Name';
	addLocation = 'Add Grow Run Location';
}

export const growRunActionNames = new GrowRunActionNames();
