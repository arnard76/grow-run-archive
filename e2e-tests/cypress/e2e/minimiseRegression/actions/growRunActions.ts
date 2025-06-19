import dayjs from '@grow-run-archive/dayjs';
import {
	Coords,
	GrowRun,
	growRunActionNames,
	Harvest,
	ResourceUsage
} from '@grow-run-archive/definitions';

import { mockLocation } from '../../../mocks/location';
import { EntitiesManager, EntityManager } from '../entity/manager';
import {
	formatHarvestsAsObjects,
	formatUsageOfResourcesAsObjects
} from '../util/convertStringRequirementsToObjects';
import { GrowRunEnvironmentManager } from './growRunEnvironmentActions';
import { UserCredentials } from './userActions';

class GrowRunsManager extends EntitiesManager {
	constructor() {
		super('Grow Run', '/grow-runs');
	}

	deleteSingle(): void {
		cy.get('dialog').findByTitle(growRunActionNames.delete).click();
	}

	deleteAll() {
		this.goToAll();
		const entities = cy.get('table tr');

		entities.each(($entity, index, ...rest) => {
			if (index === 0) return;
			cy.wrap($entity).findByRole('link').click();
			this.deleteSingle();
		});
	}
}

export const growRunsManager = new GrowRunsManager();

export class GrowRunManager implements EntityManager {
	growRunName: GrowRun['name'];
	environment: GrowRunEnvironmentManager;

	constructor(growRunName: GrowRun['name'], existingGrowRun = false) {
		this.growRunName = growRunName;
		this.environment = new GrowRunEnvironmentManager(growRunName);
		growRunsManager.goToAll();
		if (!existingGrowRun) this.add();
	}

	add() {
		actionsMenu.open();
		cy.findByPlaceholderText(/grow run name/i).type(this.growRunName);
		cy.findByTitle(growRunActionNames.add).click();
		actionsMenu.close();
	}

	delete() {}

	get preview() {
		return cy.contains('tr', this.growRunName);
	}

	// SECTIONS

	get heroSection() {
		return cy.findParentByHeading('section', this.growRunName).scrollIntoView();
	}

	get resourceUsageSection() {
		return cy.findParentByHeading('section', /Resources used/i).scrollIntoView();
	}

	get harvestsSection() {
		return cy.findParentByHeading('section', /harvests/i).scrollIntoView();
	}

	// GROW RUN DETAILS

	get location() {
		return this.heroSection.find('p').eq(0).findByRole('link').invoke('removeAttr', 'target');
	}

	get duration() {
		return this.heroSection.contains(/duration/i).find('span');
	}

	// ANALYSIS

	get totalHarvest() {
		return this.harvestsSection.find('.summary').contains('Total').parent().children().eq(1);
	}

	get averageLeafWeight() {
		return this.harvestsSection.find('.summary').contains('Average').parent().children().eq(1);
	}

	get totalCost() {
		return this.resourceUsageSection.find('li').contains('Total cost').parent().children().eq(1);
	}

	get totalCostPerUnit() {
		growRunsManager.goToAll();
		return this.preview.find('td').eq(3);

		// Another method 👇👇 : user opens grow run to see this stat?
		// return this.resourceUsageSection
		// 	.find('.summary')
		// 	.contains('Total cost')
		// 	.parent()
		// 	.find('span')
		// 	.eq(1)
		// 	.scrollIntoView();
	}

	// ACTIONS

	goTo() {
		this.preview.findByRole('link').click();
		this.heroSection.find('h2').contains(this.growRunName);
	}

	showAllDetails = this.goTo;

	start(startTime?: dayjs.Dayjs) {
		this.heroSection.find(`button[title='${growRunActionNames.changeStartAndEnd}']`).click();
		startTime = startTime || dayjs();
		const startTimeInput = startTime.format('YYYY-MM-DDTHH:mm');
		cy.findByLabelText(/Start Date:/i).type(startTimeInput);
		this.heroSection.find(`button[title='${growRunActionNames.finishEdit}']`).click();

		// Check that GR has started
		cy.reload();
		const displayedStartTime = startTime.format('D MMM YYYY, h:mm a');
		cy.findByText(displayedStartTime).should('be.visible');
	}

	get duration() {
		return this.heroSection.contains(/duration/i).find('i');
	}

	/** 
	 * location formats:
	 - TODO: through device location
	 - through coords ✅
	 - TODO: through address search
	 */
	addLocationByCoords(
		method: 'address search' | 'coords' | 'device location',
		value: string | Coords
	) {
		cy.visit(`/grow-runs`, typeof value !== 'string' && mockLocation(value));
		this.goTo();

		actionsMenu.open();
		actionsMenu.get().findByRole('button', { name: growRunActionNames.changeLocation }).click();
		const changeLocationModal = new ActionModal(growRunActionNames.changeLocation);
		if (typeof value === 'string') {
		}

		if (method === 'address search') {
			if (typeof value !== 'string') throw Error('value must be string, not Coords');
			this.heroSection.findAllByLabelText(/address/i).type(value);
			this.heroSection.find('select').select(value);
		} else if (method === 'coords') {
			if (typeof value === 'string') throw Error('value must be Coords, not string');
			changeLocationModal
				.get()
				.findByLabelText(/latitude/i)
				.type(value.latitude.toString());
			changeLocationModal
				.get()
				.findByLabelText(/longitude/i)
				.type(value.longitude.toString());
		} else if (method === 'device location') {
			changeLocationModal.get().findByRole('button', {
				name: /use my location/i
			});
		} else {
			throw Error(`Method ${method} can not be used to add a grow run location.`);
		}

		changeLocationModal.get().should('include.text', 'Address: ');
		changeLocationModal
			.get()
			.findByRole('button', { name: growRunActionNames.changeLocation })
			.click();
		// if (method === 'address search')
		// 	this.heroSection.contains(value as string).should('be.visible');
		changeLocationModal.close();
	}

	manuallyRecordUsageOfResources(usageOfResourcesInput: (ResourceUsage | string)[]) {
		if (!usageOfResourcesInput.length) return;

		let usageOfResources: ResourceUsage[];
		if (typeof usageOfResourcesInput[0] === 'string') {
			usageOfResources = formatUsageOfResourcesAsObjects(usageOfResourcesInput as string[]);
		} else {
			usageOfResources = usageOfResourcesInput as ResourceUsage[];
		}

		usageOfResources.forEach((usageOfResource) => {
			actionsMenu.open().findByTitle(growRunActionNames.useResource).click();
			const useResourceDialog = new ActionModal(growRunActionNames.useResource);
			useResourceDialog
				.get()
				.find('input[type="number"]')
				.type(usageOfResource.amountUsed.toString());
			useResourceDialog.get().find('select').select(usageOfResource.resourceName);
			useResourceDialog.get().findByTitle(growRunActionNames.useResource).click();
			useResourceDialog.close();
			actionsMenu.close();
		});
	}

	manuallyRecordHarvest(harvestsInput: (Harvest | string)[]) {
		if (!harvestsInput.length) return;

		let harvests: Harvest[];
		if (typeof harvestsInput[0] === 'string') {
			harvests = formatHarvestsAsObjects(harvestsInput as string[]);
		} else {
			harvests = harvestsInput as Harvest[];
		}

		harvests.forEach((harvest) => {
			actionsMenu.open().findByTitle(growRunActionNames.recordHarvest).click();
			const recordHarvestDialog = new ActionModal(growRunActionNames.recordHarvest);

			recordHarvestDialog
				.get()
				.find('input[type="number"]')
				.eq(0)
				.type(harvest.numberOfLeaves.toString());
			recordHarvestDialog
				.get()
				.find('input[type="number"]')
				.eq(1)
				.type(harvest.massOfLeaves.toString());
			if (harvest.datetime === 'now')
				recordHarvestDialog.get().find('input[type="checkbox"]').check();
			recordHarvestDialog.get().findByTitle(growRunActionNames.recordHarvest).click();
			recordHarvestDialog.close();
			actionsMenu.close();
		});
	}

	end(endTime?: dayjs.Dayjs) {
		cy.window().then((win) => {
			this.heroSection.find(`button[title='${growRunActionNames.changeStartAndEnd}']`).click();
			endTime = endTime || dayjs(win.Date());
			const endTimeInput = endTime.format('YYYY-MM-DDTHH:mm');
			cy.findByLabelText(/End Date:/i).type(endTimeInput);
			this.heroSection.find(`button[title='${growRunActionNames.finishEdit}']`).click();

			cy.reload();
			const displayedEndTime = endTime.format('D MMM YYYY, h:mm a');
			this.heroSection.findByText(displayedEndTime).should('be.visible');
		});
	}

	hideAllDetails() {
		cy.get(`dialog button[title="${growRunActionNames.close}"]`).click();
	}
}
