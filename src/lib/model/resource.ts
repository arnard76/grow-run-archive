export default class Resource {
	name: string;
	cost: number;
	amountType: string;
	amountUnit: string;
	amountTotal: number;
	notes: string;

	constructor(
		name: string,
		cost: number,
		amountType: string,
		amountUnit: string,
		amountTotal: number,
		notes: string
	) {
		this.name = name;
		this.cost = cost;
		this.amountType = amountType;
		this.amountUnit = amountUnit;
		this.amountTotal = amountTotal;
		this.notes = notes;
	}

	calculateCost(amountUsed: number): number {
		return (this.cost * amountUsed) / this.amountTotal;
	}
}

export type ResourceUsage = {
	name: string;
	amountUsed: number;
};
