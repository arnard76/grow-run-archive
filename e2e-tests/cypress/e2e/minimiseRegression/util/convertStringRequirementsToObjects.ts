import dayjs from '@grow-run-archive/dayjs';
import {
	Harvest,
	ExternalResource,
	ResourceUsage,
	decideHowToMeasureQuantityDependingOnUnit as deduceQuantityMeasureFromUnit
} from '@grow-run-archive/definitions';
import floatRegex from 'float-regex';

export function formatResourcesAsObjects(resourceStrings: string[]): ExternalResource[] {
	return resourceStrings.map((resource: string) => {
		const amountPurchased = parseFloat(resource.match(floatRegex)![0]);
		const unit = resource.split(amountPurchased.toString())[1].split(' ', 1)[0];
		const costText = resource.split(`${amountPurchased}${unit}`)[1].match(floatRegex)![0];
		assert(resource.includes(` $${costText} `), "couldn't find cost from resource definition");
		const quantityMeasuredBy = deduceQuantityMeasureFromUnit(unit);
		const name = resource.split(' for ')[0].split(`${unit} `)[1];
		const cost = parseFloat(costText);

		return { name, cost, unit, quantityMeasuredBy, amountPurchased };
	});
}

export function formatUsageOfResourcesAsObjects(usageOfResources: string[]): ResourceUsage[] {
	return usageOfResources.map((resource: string) => {
		const amountUsed = parseFloat(resource.match(floatRegex)![0]);
		// assumes unit is the same as the resource
		const unit = resource.split(amountUsed.toString())[1].split(' ', 1)[0];
		const resourceName = resource.split(`${amountUsed}${unit} `)[1];

		return { resourceName, amountUsed, datetime: dayjs().toISOString() };
	});
}

export function formatHarvestsAsObjects(harvests: string[]): Harvest[] {
	return harvests.map((harvest) => {
		const [massOfLeaves, leaves] = harvest.split(' ');
		const massOfLeavesInGrams = parseFloat(massOfLeaves.split('g')[0]);
		const numberOfLeaves = parseFloat(leaves.split('leaves')[0]);

		return { massOfLeaves: massOfLeavesInGrams, numberOfLeaves, datetime: 'now' };
	});
}
