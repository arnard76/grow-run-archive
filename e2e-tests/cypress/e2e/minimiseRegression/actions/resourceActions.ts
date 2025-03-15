import { Resource, resourceActionNames } from '@grow-run-archive/definitions';
import { EntitiesManager, EntityManager } from '../entity/manager';

class ResourcesManager extends EntitiesManager {
	constructor() {
		super('Resource', '/resources');
		this.entityActionNames = resourceActionNames;
	}

	addMultiple(resources: Resource[]) {
		this.goToAll();
		return resources.map((resource) => new ResourceManager(resource, false));
	}
}

export const resourcesManager = new ResourcesManager();

export class ResourceManager implements EntityManager {
	resource: Resource;

	constructor(resource: Resource, existingResource = false) {
		this.resource = resource;
		if (!existingResource) this.add();
	}

	add() {
		const addResourceButton = cy.findByTitle(resourceActionNames.add);
		addResourceButton.click();
		cy.findByTitle('Select how the amount of this resource is specified').select(
			this.resource.quantity
		);
		cy.findByPlaceholderText('amount', { exact: true }).type(this.resource.amount);
		cy.findByTitle('Select the unit of measuring an amount of this resource').select(
			this.resource.unit
		);

		cy.findByPlaceholderText(/resource name/i).type(this.resource.name);
		cy.findByPlaceholderText(/product price/i).type(this.resource.cost);
		// cy.findByLabelText('product link').type(
		// 	'https://www.thewarehouse.co.nz/p/kiwi-garden-lettuce-butterhead-seeds/R2598667.html?srsltid=AfmBOoowGtKN5J2-GXV1U_bHxy-Hw_5MeMAgGA98eQTrduCCh3i5cwe1oNI&gStoreCode=188'
		// );
		addResourceButton.click();
	}

	private get preview() {
		return cy.contains('tr', this.resource.name);
	}

	goTo() {
		this.preview.click();
	}

	showAllDetails = this.goTo;

	delete() {
		resourcesManager.deleteSingle();
	}
}
