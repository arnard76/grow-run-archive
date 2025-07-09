import { ExternalResource as Resource, resourceActionNames } from '@grow-run-archive/definitions';
import { EntitiesManager, EntityManager } from '../entity/manager';
import { actionsMenu } from '../entity/actions';

class ResourcesManager extends EntitiesManager {
	constructor() {
		super({ name: 'Resource' });
		this.actionNames = resourceActionNames;
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
		actionsMenu.open();
		cy.findByTitle('Select how the amount of this resource is specified').select(
			this.resource.quantityMeasuredBy
		);
		cy.findByPlaceholderText('amount', { exact: true }).type(
			this.resource.amountPurchased.toString()
		);
		cy.findByTitle('Select the unit of measuring an amount of this resource').select(
			this.resource.unit
		);

		cy.findByPlaceholderText(/resource name/i).type(this.resource.name);
		cy.findByPlaceholderText(/price/i).type(this.resource.cost.toString());
		// cy.findByLabelText('page URL').type(
		// 	'https://www.thewarehouse.co.nz/p/kiwi-garden-lettuce-butterhead-seeds/R2598667.html?srsltid=AfmBOoowGtKN5J2-GXV1U_bHxy-Hw_5MeMAgGA98eQTrduCCh3i5cwe1oNI&gStoreCode=188'
		// );
		cy.findByTitle(resourceActionNames.add).click();
		actionsMenu.close();
	}

	get preview() {
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
