import { ResourceUsage } from '@grow-run-archive/definitions';
import { Resource } from '../actions/resourceActions';
const numberMatchRegex = /[+-]?\d+(\.\d+)?/g;

const quantities = { mL: 'volume', L: 'volume', pcs: 'number' };

export function formatResourcesAsObjects(resourceStrings: string[]): Resource[] {
	return resourceStrings.map((resource: string) => {
		const amount = resource.match(numberMatchRegex)[0];
		const unit = resource.split(amount)[1].split(' ', 1)[0];
		const cost = resource.split(`${amount}${unit}`)[1].match(numberMatchRegex)[0];
		assert(resource.includes(` $${cost} `), "couldn't find resource cost from string definition");
		const quantity = quantities[unit];
		const name = resource.split(' for ')[0].split(`${unit} `)[1];

		return { name, cost, unit, quantity, amount };
	});
}

export function formatUsageOfResourcesAsObjects(usageOfResources: string[]): ResourceUsage[] {
	return usageOfResources.map((resource: string) => {
		const amountUsed = parseFloat(resource.match(numberMatchRegex)[0]);
		// assumes unit is the same as the resource
		const unit = resource.split(amountUsed.toString())[1].split(' ', 1)[0];
		const resourceName = resource.split(`${amountUsed}${unit} `)[1];

		return { resourceName, amountUsed };
	});
}
