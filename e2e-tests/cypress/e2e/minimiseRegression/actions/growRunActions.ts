import dayjs from '@grow-run-archive/dayjs';
import {
	Coords,
	ExternalResource,
	GrowRun,
	growRunActionNames,
	GrowSetupType,
	Harvest,
	ResourceUsage
} from '@grow-run-archive/definitions';

import { mockLocation } from '../../../mocks/location';
import { actionsMenu, ActionsMenuModal, performAction } from '../entity/actions';
import { EntitiesManager, EntityManager } from '../entity/manager';
import {
	formatHarvestsAsObjects,
	formatUsageOfResourcesAsObjects
} from '../util/convertStringRequirementsToObjects';
import { GrowRunEnvironmentManager } from './growRunEnvironmentActions';
import { GrowSetupManager } from './growSetupActions';
import { resourcesManager } from './resourceActions';

type AddressDescription = {
	suburb: string;
	city: string;
	country: string;
};

type LocationDescription =
	| { address: AddressDescription; coords: Coords }
	| { address: AddressDescription; coords?: Coords };

class GrowRunsManager extends EntitiesManager {
	constructor() {
		super({ name: 'Grow Run' });
	}

	deleteSingle(): void {
		performAction(actionsMenu, growRunActionNames.delete, () => null, true);
	}

	deleteAll() {
		this.goToAll();
		const entities = cy.get('table tr');

		entities.each(($entity, index) => {
			if (index === 0) return;
			cy.wrap($entity).findByRole('link').click();
			// needs to navigate to record page
			cy.url().should('not.equal', `${Cypress.env('UI_URL')}${this.URL}`);
			this.deleteSingle();
		});
	}
}

export const growRunsManager = new GrowRunsManager();

export class GrowRunManager implements EntityManager {
	growRunName: GrowRun['name'];
	environment: GrowRunEnvironmentManager;
	actionsMenu = new ActionsMenuModal('Grow Run Actions', 'Actions Menu 📃');

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

	get growSetup() {
		return this.heroSection.find('a').contains(/Grow Setup #/);
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

	setup({
		resourcesForGrowRun,
		location,
		growSetup
	}: {
		resourcesForGrowRun?: ExternalResource[];
		growSetup: GrowSetupManager;
		location?: LocationDescription;
	}) {
		resourcesManager.addMultiple(resourcesForGrowRun || []);
		growRunsManager.goToAll();
		this.goTo();

		if (location) {
			this.addLocation('with coords', location.coords);
			this.testLocationIsSet(location);
		}

		if (growSetup) {
			this.changeGrowSetupTo(growSetup.growSetupVersion);
		}
	}

	changeGrowSetupTo(growSetupVersion: GrowSetupType['version']) {
		performAction(this.actionsMenu, growRunActionNames.changeGrowSetup, (getModal) => {
			// getModal().find('select').select(growSetupVersion);
		});

		this.testGrowSetupIsSetTo(growSetupVersion);
	}

	testGrowSetupIsSetTo(expectedGrowSetup: GrowSetupType['version']) {
		this.growSetup.contains(`Grow Setup #${expectedGrowSetup}`).should('be.visible');
	}

	addLocation(method: 'with coords' | 'with device location', coords?: Coords) {
		cy.visit(growRunsManager.URL, mockLocation(coords));
		this.goTo();

		performAction(this.actionsMenu, growRunActionNames.changeLocation, (getModal) => {
			if (method === 'with coords') {
				if (!coords) throw Error('coords must be provided if using coords to input location');
				getModal()
					.findByLabelText(/latitude/i)
					.type(coords.latitude.toString());
				getModal()
					.findByLabelText(/longitude/i)
					.type(coords.longitude.toString());
			} else if (method === 'with device location') {
				getModal().findByRole('button', {
					name: /Get Current Location/i
				});
			}
			getModal().should('include.text', 'Address: ');
		});
	}

	testLocationIsSet(expectedLocation: undefined | LocationDescription) {
		growRunsManager.goToAll();

		if (!expectedLocation) {
			this.goTo();
			this.location.should('include.text', 'No location');
			return;
		}

		const { address, coords } = expectedLocation;

		this.preview.invoke('text').then((text) => {
			const cityOrSuburbDisplayed = text.includes(address.city) || text.includes(address.suburb);
			expect(cityOrSuburbDisplayed).to.be.true;
		});
		this.goTo();
		this.location.invoke('text').then((text) => {
			const cityOrSuburbDisplayedInLocationSummary =
				text.includes(`${address.city}, ${address.country}`) ||
				text.includes(`${address.suburb}, ${address.country}`);
			expect(cityOrSuburbDisplayedInLocationSummary).to.be.true;
		});

		if (coords) {
			this.location
				.invoke('attr', 'href')
				.should(
					'equal',
					`https://www.google.com/maps/place/${coords.latitude},${coords.longitude}`
				);
		}
	}

	start() {
		performAction(this.actionsMenu, growRunActionNames.start, () => null, true);
		cy.window().then((win) => this.testStartTimeCorrect(dayjs(win.Date())));
	}

	testStartTimeCorrect(expectedStartTime: dayjs.Dayjs) {
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

	manuallyRecordUsageOfResources(usageOfResourcesInput: (ResourceUsage | string)[]) {
		if (!usageOfResourcesInput.length) return;

		let usageOfResources: ResourceUsage[];
		if (typeof usageOfResourcesInput[0] === 'string') {
			usageOfResources = formatUsageOfResourcesAsObjects(usageOfResourcesInput as string[]);
		} else {
			usageOfResources = usageOfResourcesInput as ResourceUsage[];
		}

		performAction(this.actionsMenu, growRunActionNames.useResource, (getModal) => {
			usageOfResources.forEach((usageOfResource, index) => {
				getModal().find('input[type="number"]').type(usageOfResource.amountUsed.toString());
				getModal().find('select').select(usageOfResource.resourceName);
				if (index !== usageOfResources.length - 1)
					getModal().findByTitle(growRunActionNames.useResource).click();
			});
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

		performAction(this.actionsMenu, growRunActionNames.recordHarvest, (getModal) => {
			harvests.forEach((harvest, index) => {
				getModal().find('input[type="number"]').eq(0).type(harvest.numberOfLeaves.toString());
				getModal().find('input[type="number"]').eq(1).type(harvest.massOfLeaves.toString());
				if (harvest.datetime === 'now') getModal().find('input[type="checkbox"]').check();
				if (index !== harvests.length - 1)
					getModal().findByTitle(growRunActionNames.recordHarvest).click();
			});
		});
	}

	end() {
		performAction(this.actionsMenu, growRunActionNames.end, () => null, true);
		cy.window().then((win) => this.testEndTimeCorrect(dayjs(win.Date())));
	}

	testEndTimeCorrect(expectedEndTime: dayjs.Dayjs) {
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
