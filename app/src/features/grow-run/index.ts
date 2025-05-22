import type Resource from '$features/resource';
import { resourcesList } from '$features/resource/store';
import { session } from '$lib/user/user';
import { getDatabase, push, ref } from '@firebase/database';
import type {
	ConditionMeasurement,
	ConditionsMeasurements as ConditionsData,
	GrowRun as GrowRunType,
	Harvest,
	ResourceUsage
} from '@grow-run-archive/definitions';
import dayjs from 'dayjs';
import { set } from 'firebase/database';
import { get } from 'svelte/store';

export default class GrowRun {
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
		for (let { resourceName: name, amountUsed } of this.resources?.used || []) {
			const resource = resourcesList.getResource(name, resources);
			if (!resource) continue;
			let oneCost = resource.calculateCost(amountUsed) || 0;
			totalCost += oneCost;
		}

		return totalCost;
	}

	calculateCostPer100g(resources: Resource[]): number {
		return (this.calculateCost(resources) * 100) / this.totalMassLeavesHarvested();
	}

	formatDataForPieChart(
		resources: Resource[] | undefined = undefined
	): { label: string; size: number; colour: string }[] {
		return (
			this.resources?.used?.map(({ resourceName: name, amountUsed }) => {
				const resource = resourcesList.getResource(name, resources);
				const resourceCost = resource.calculateCost(amountUsed);
				return { size: resourceCost, label: name, colour: resource.colour };
			}) || []
		);
	}

	calculateDurationInDays(): number {
		const start = this.duration?.start;
		const end = this.duration?.end || dayjs();
		if (!start) return NaN;

		return dayjs(end).diff(start, 'days', true);
	}

	recordCondition(condition: keyof ConditionsData, { dateTime, value }: ConditionMeasurement) {
		this.conditions[condition] = this.conditions[condition] || {};

		if (
			Object.values(this.conditions[condition])
				.map((record) => record.dateTime)
				.includes(dateTime)
		)
			throw Error('This date time already has a temperature recorded. Try editing instead?');

		// this.conditions[medium]?.push({ dateTime, value });
		set(
			push(
				ref(getDatabase(), `${get(session).user?.uid}/grow-runs/${this.id}/conditions/${condition}`)
			),
			{ dateTime, value }
		);
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
