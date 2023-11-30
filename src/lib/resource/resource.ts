export default class Resource {
	name: string;
	cost: number;
	amountType: string;
	amountUnit: string;
	amountTotal: number;
	colour: string;
	notes: string;

	constructor(
		name: string,
		cost: number,
		amountType: string,
		amountUnit: string,
		amountTotal: number,
		colour: string,
		notes: string
	) {
		this.name = name;
		this.cost = cost;
		this.amountType = amountType;
		this.amountUnit = amountUnit;
		this.amountTotal = amountTotal;
		this.colour = colour || 'black';
		this.notes = notes;
	}

	calculateCost(amountUsed: number): number {
		return (this.cost * amountUsed) / this.amountTotal;
	}
}
