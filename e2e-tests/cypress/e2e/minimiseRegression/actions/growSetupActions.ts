import {
	growSetupActionNames,
	GrowSetupType,
	ExternalResource as Resource,
	resourceActionNames
} from '@grow-run-archive/definitions';
import { EntitiesManager, EntityManager } from '../entity/manager';
import { actionsMenu } from '../entity/actions';

class GrowSetupsManager extends EntitiesManager {
	constructor() {
		super({ name: 'Grow Setup' });
		this.actionNames = resourceActionNames;
	}
}

export const growSetupsManager = new GrowSetupsManager();

export class GrowSetupManager implements EntityManager {
	growSetupVersion: GrowSetupType['version'];

	constructor(growSetupVersion: GrowSetupType['version'], existingResource = false) {
		this.growSetupVersion = growSetupVersion;
		growSetupsManager.goToAll();
		if (!existingResource) this.add();
	}

	get preview() {
		return cy.contains('tr', this.growSetupVersion);
	}

	add() {
		actionsMenu.open();
		cy.findByTitle(growSetupActionNames.add).click();
		actionsMenu.close();
	}

	goTo() {
		this.preview.click();
	}

	showAllDetails = this.goTo;

	delete = growSetupsManager.deleteSingle;
}
