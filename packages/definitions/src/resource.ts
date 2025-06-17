import { ActionNames } from './entity/actions.js';

export type ResourceType = any;
export const resourceActionNames = new ActionNames('Resource');

export class Resource {
	id: string;
	name: string;
	productLink: string;
	cost: number;
	amountType: string;
	amountUnit: string;
	amountTotal: number;
	colour: string;
	notes: string;

	constructor({
		id,
		name,
		productLink,
		cost,
		amountType,
		amountUnit,
		amountTotal,
		colour,
		notes
	}: {
		id: string;
		name: string;
		productLink: string;
		cost: number;
		amountType: string;
		amountUnit: string;
		amountTotal: number;
		colour?: string;
		notes?: string;
	}) {
		this.id = id;
		this.name = name;
		this.productLink = productLink || '#no-product-link-provided';
		this.cost = cost;
		this.amountType = amountType;
		this.amountUnit = amountUnit;
		this.amountTotal = amountTotal;
		this.colour = colour || 'black';
		this.notes = notes || '';
	}

	calculateCost(amountUsed: number): number {
		return (this.cost * amountUsed) / this.amountTotal;
	}

	static emptyResourceInstance(): Resource {
		return new Resource({} as any);
	}
}
