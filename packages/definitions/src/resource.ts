import { ActionNames } from './entity/actions.js';
import { units } from './units.js';

export type ExternalResource = {
	name: string;
	productLink?: string;
	cost: number;
	quantityMeasuredBy: keyof typeof units;
	amountPurchased: number;
	unit: string;
	notes?: string;
};

export const resourceActionNames = new ActionNames('Resource');

export class Resource {
	id: string;
	name: ExternalResource['name'];
	productLink: ExternalResource['productLink'];
	cost: ExternalResource['cost'];
	amountType: ExternalResource['quantityMeasuredBy'];
	amountUnit: ExternalResource['unit'];
	amountTotal: ExternalResource['amountPurchased'];
	notes: ExternalResource['notes'];
	colour: string;

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
		name: ExternalResource['name'];
		productLink: ExternalResource['productLink'];
		cost: ExternalResource['cost'];
		amountType: ExternalResource['quantityMeasuredBy'];
		amountUnit: ExternalResource['unit'];
		amountTotal: ExternalResource['amountPurchased'];
		notes?: ExternalResource['notes'];
		colour?: string;
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
