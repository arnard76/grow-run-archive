import { GrowRun, growRunActionNames, Harvest, ResourceUsage } from '@grow-run-archive/definitions';
import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
import DayJSUtc from 'dayjs/plugin/utc';
import {
	formatHarvestsAsObjects,
	formatUsageOfResourcesAsObjects
} from '../util/convertStringRequirementsToObjects';
import { EntitiesManager, EntityManager } from '../entity/manager';

dayjs.extend(Timezone);
dayjs.extend(DayJSUtc);

export const growRunsManager = new EntitiesManager('Grow Run', '/grow-runs');

export class GrowRunManager implements EntityManager {
	growRunName: GrowRun['name'];

	constructor(growRunName: GrowRun['name'], existingGrowRun = false) {
		this.growRunName = growRunName;
		growRunsManager.goToAll();
		if (!existingGrowRun) this.add();
	}

	add() {
		const addGrowRunButton = cy.findByTitle(growRunActionNames.add);
		addGrowRunButton.click();
		cy.findByPlaceholderText(/grow run name/i).type(this.growRunName);
		addGrowRunButton.click();
	}

	delete() {}

	private get preview() {
		return cy.contains('tr', this.growRunName);
	}

	goTo() {
		this.preview.click();
	}

	showAllDetails = this.goTo;

	start() {
		this.heroSection.find(`button[title='${growRunActionNames.changeStartAndEnd}']`).click();
		const startTime = dayjs();
		const startTimeInput = startTime.format('YYYY-MM-DDTHH:mm');
		cy.findByLabelText(/Start Date:/i).type(startTimeInput);
		this.heroSection.find(`button[title='${growRunActionNames.finishEdit}']`).click();

		// Check that GR has started
		cy.reload();
		this.showAllDetails();
		const displayedStartTime = startTime.tz('UTC').format('D MMM YYYY, h:mm a');
		cy.findByText(displayedStartTime).should('be.visible');
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
			const addResourceButton = this.resourceUsageSection.findByRole('button', { name: 'Record' });
			addResourceButton.click();
			this.resourceUsageSection
				.find('input[type="number"]')
				.type(usageOfResource.amountUsed.toString());
			this.resourceUsageSection.find('select').select(usageOfResource.resourceName);
			addResourceButton.click();
		});
	}

	private get heroSection() {
		return cy.get('dialog > section').eq(0).scrollIntoView();
	}

	private get resourceUsageSection() {
		return cy.get('dialog > section').eq(1).scrollIntoView();
	}

	private get harvestsSection() {
		return cy.get('dialog > section').eq(2).scrollIntoView();
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
			const addHarvestButton = this.harvestsSection.findByRole('button', { name: 'Record' });
			addHarvestButton.click();
			this.harvestsSection
				.find('input[type="number"]')
				.eq(0)
				.type(harvest.numberOfLeaves.toString());
			this.harvestsSection.find('input[type="number"]').eq(1).type(harvest.massOfLeaves.toString());
			if (harvest.datetime === 'now') this.harvestsSection.find('input[type="checkbox"]').check();
			addHarvestButton.click();
		});
	}

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

		// Another 👇👇 : user opens grow run to see this stat?
		// return this.resourceUsageSection
		// 	.find('.summary')
		// 	.contains('Total cost')
		// 	.parent()
		// 	.find('span')
		// 	.eq(1)
		// 	.scrollIntoView();
	}

	end() {
		cy.window().then((win) => {
			this.heroSection.find(`button[title='${growRunActionNames.changeStartAndEnd}']`).click();
			let endTime = dayjs(win.Date());
			const endTimeInput = endTime.format('YYYY-MM-DDTHH:mm');
			cy.findByLabelText(/End Date:/i).type(endTimeInput);
			this.heroSection.find(`button[title='${growRunActionNames.finishEdit}']`).click();

			cy.reload();
			this.showAllDetails();
			const displayedStartTime = endTime.tz('UTC').format('D MMM YYYY, h:mm a');
			this.heroSection.findByText(displayedStartTime).should('be.visible');
		});
	}

	hideAllDetails() {
		cy.get(`dialog button[title="${growRunActionNames.close}"]`).click();
	}
}
