import dayjs from '@grow-run-archive/dayjs';
import {
	Coords,
	GrowRun,
	growRunActionNames,
	Harvest,
	Location,
	ResourceUsage
} from '@grow-run-archive/definitions';

import { mockLocation } from '../../../mocks/location';
import { ActionModal, actionsMenu } from '../entity/actions';
import { EntitiesManager, EntityManager } from '../entity/manager';
import {
	formatHarvestsAsObjects,
	formatUsageOfResourcesAsObjects
} from '../util/convertStringRequirementsToObjects';
import { GrowRunEnvironmentManager } from './growRunEnvironmentActions';

class GrowRunsManager extends EntitiesManager {
	constructor() {
		super('Grow Run', '/grow-runs');
		this.goToAllMethods.push(() =>
			cy.get('nav').findByRole('link', { name: this.entityPluralName }).click()
		);
	}

	deleteSingle(): void {
		actionsMenu.open();
		cy.findByTitle(growRunActionNames.delete).click();
		cy.findByRole('button', { name: /yes/i }).click();
	}

	deleteAll() {
		this.goToAll();
		const entities = cy.get('table tr');

		entities.each(($entity, index, ...rest) => {
			if (index === 0) return;
			cy.wrap($entity).findByRole('link').click();
			// needs to navigate to record page
			cy.url().should('not.equal', `${Cypress.env('PUBLIC_UI_URL')}${this.entityURL}`);
			this.deleteSingle();
		});
	}
}

export const growRunsManager = new GrowRunsManager();

export class GrowRunManager implements EntityManager {
	growRunName: GrowRun['name'];
	environment: GrowRunEnvironmentManager;
	actionsMenu = new ActionModal('Grow Run Actions', 'Actions Menu 📃');

	constructor(growRunName: GrowRun['name'], existingGrowRun = false) {
		this.growRunName = growRunName;
		this.environment = new GrowRunEnvironmentManager(growRunName);
		growRunsManager.goToAll();
		if (!existingGrowRun) this.add();
	}

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

	add() {
		actionsMenu.open();
		cy.findByPlaceholderText(/grow run name/i).type(this.growRunName);
		cy.findByTitle(growRunActionNames.add).click();
		actionsMenu.close();
	}

	delete = growRunsManager.deleteSingle;

	goTo() {
		this.preview.findByRole('link').click();
		this.heroSection.find('h2').contains(this.growRunName);
	}

	showAllDetails = this.goTo;

	start() {
		cy.window().then((win) => {
			this.actionsMenu.open();
			cy.findByTitle(growRunActionNames.start).click();
			cy.findByRole('button', { name: /yes/i }).click();
			this.checkStartTimeCorrect(dayjs(win.Date()));
		});
	}

	checkStartTimeCorrect(expectedStartTime: dayjs.Dayjs) {
		cy.reload();
		this.heroSection
			.findByText('Started:', { exact: false })
			.invoke('text')
			.then((text) => {
				const displayedDate = text.split('Started: ')[1];
				expect(dayjs(displayedDate, 'D MMM YYYY, h:mm a', true).isValid()).to.equal(true);
				expect(Math.abs(dayjs(displayedDate).diff(expectedStartTime))).to.be.lessThan(120_000);
			});
	}

	addLocation(method: 'with coords' | 'with device location', coords?: Coords) {
		cy.visit(growRunsManager.entityURL, mockLocation(coords));
		this.goTo();

		this.actionsMenu.open();
		this.actionsMenu
			.get()
			.findByRole('button', { name: growRunActionNames.changeLocation })
			.click();
		const changeLocationModal = new ActionModal(growRunActionNames.changeLocation);

		if (method === 'with coords') {
			if (!coords) throw Error('coords must be provided if using coords to input location');
			changeLocationModal
				.get()
				.findByLabelText(/latitude/i)
				.type(coords.latitude.toString());
			changeLocationModal
				.get()
				.findByLabelText(/longitude/i)
				.type(coords.longitude.toString());
		} else if (method === 'with device location') {
			changeLocationModal.get().findByRole('button', {
				name: /use my location/i
			});
		}

		changeLocationModal.get().should('include.text', 'Address: ');
		changeLocationModal
			.get()
			.findByRole('button', { name: growRunActionNames.changeLocation })
			.click();
		changeLocationModal.close();
		this.actionsMenu.close();
	}

	checkLocationIsSet(location: undefined | Location) {
		growRunsManager.goToAll();

		if (!location) {
			this.goTo();
			this.location.should('include.text', 'No location');
			return;
		}

		this.preview.should('include.text', location.address.city);
		this.goTo();
		this.location
			.should('include.text', `${location.address.city}, ${location.address.country}`)
			.invoke('attr', 'href')
			.should(
				'equal',
				`https://www.google.com/maps/place/${location.latitude},${location.longitude}`
			);
	}

	manuallyRecordUsageOfResources(usageOfResourcesInput: (ResourceUsage | string)[]) {
		if (!usageOfResourcesInput.length) return;

		let usageOfResources: ResourceUsage[];
		if (typeof usageOfResourcesInput[0] === 'string') {
			usageOfResources = formatUsageOfResourcesAsObjects(usageOfResourcesInput as string[]);
		} else {
			usageOfResources = usageOfResourcesInput as ResourceUsage[];
		}

		const useResourceDialog = new ActionModal(growRunActionNames.useResource);
		this.actionsMenu.open().findByTitle(growRunActionNames.useResource).click();
		usageOfResources.forEach((usageOfResource) => {
			useResourceDialog
				.get()
				.find('input[type="number"]')
				.type(usageOfResource.amountUsed.toString());
			useResourceDialog.get().find('select').select(usageOfResource.resourceName);
			useResourceDialog.get().findByTitle(growRunActionNames.useResource).click();
		});
		useResourceDialog.close();
		this.actionsMenu.close();
	}

	manuallyRecordHarvest(harvestsInput: (Harvest | string)[]) {
		if (!harvestsInput.length) return;

		let harvests: Harvest[];
		if (typeof harvestsInput[0] === 'string') {
			harvests = formatHarvestsAsObjects(harvestsInput as string[]);
		} else {
			harvests = harvestsInput as Harvest[];
		}

		this.actionsMenu.open().findByTitle(growRunActionNames.recordHarvest).click();
		const recordHarvestDialog = new ActionModal(growRunActionNames.recordHarvest);
		harvests.forEach((harvest) => {
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
		});
		recordHarvestDialog.close();
		this.actionsMenu.close();
	}

	end() {
		cy.window().then((win) => {
			this.actionsMenu.open();
			cy.findByTitle(growRunActionNames.end).click();
			cy.findByRole('button', { name: /yes/i }).click();
			this.checkEndTimeCorrect(dayjs(win.Date()));
		});
	}

	checkEndTimeCorrect(expectedEndTime: dayjs.Dayjs) {
		cy.reload();
		this.heroSection
			.findByText('Ended:', { exact: false })
			.invoke('text')
			.then((text) => {
				const displayedDate = text.split('Ended: ')[1];
				expect(dayjs(displayedDate, 'D MMM YYYY, h:mm a', true).isValid()).to.equal(true);
				expect(Math.abs(dayjs(displayedDate).diff(expectedEndTime))).to.be.lessThan(120_000);
			});
	}

	hideAllDetails() {
		cy.get(`dialog button[title="${growRunActionNames.close}"]`).click();
	}
}
