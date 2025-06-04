import type Resource from '$features/resource';
import { resourcesList } from '$features/resource/store';
import { session } from '$lib/user/user';
import { getDatabase, push, ref } from '@firebase/database';
import {
	GrowRun as GrowRunDefinition,
	type ConditionMeasurement,
	type ConditionsMeasurements as ConditionsData,
	type GrowRunType as GrowRunType
} from '@grow-run-archive/definitions';
import { set } from 'firebase/database';
import { get } from 'svelte/store';

export default class GrowRun extends GrowRunDefinition {
	constructor(growRunObject: GrowRunType) {
		super(growRunObject);
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
}
