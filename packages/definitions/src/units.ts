export const units = {
	volume: ['mL', 'L'],
	mass: ['g', 'kg'],
	number: ['pcs'],
	energy: ['kWh'],
	time: ['h']
};

export function decideHowToMeasureQuantityDependingOnUnit(unit: string): keyof typeof units {
	const quantityMeasure = Object.entries(units).find(([, units]) => units.includes(unit));

	if (!quantityMeasure) throw Error('Unit not found: ' + unit);

	return quantityMeasure[0] as keyof typeof units;
}
