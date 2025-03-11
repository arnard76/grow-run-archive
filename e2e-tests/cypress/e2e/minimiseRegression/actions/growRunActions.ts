import { GrowRun, Harvest, ResourceUsage } from '@grow-run-archive/definitions';
import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/Timezone';
import DayJSUtc from 'dayjs/plugin/utc';
import { closeModalButton } from './common';
import {
	formatHarvestsAsObjects,
	formatUsageOfResourcesAsObjects
} from '../util/convertStringRequirementsToObjects';

dayjs.extend(Timezone);
dayjs.extend(DayJSUtc);

export class GrowRunManager {
	static entityName = 'Grow Run';
	static clearAll() {
		cy.visit('/');
		cy.wait(4000);
		const growRuns = cy.get('table tr');

		growRuns.each(($growRun, index) => {
			if (index === 0) return;
			cy.wrap($growRun).click();
			cy.findByRole('button', { name: /Delete Grow Run/i }).click();
		});
	}

	growRunName: GrowRun['name'];

	constructor(growRunName: GrowRun['name']) {
		cy.visit('/');
		const addGrowRunButton = cy.findByRole('button', { name: /add grow run/i });
		addGrowRunButton.click();
		cy.findByPlaceholderText(/grow run name/i).type(growRunName);
		this.growRunName = growRunName;
		addGrowRunButton.click();
	}

	expandAllDetails() {
		cy.get('td').contains(this.growRunName).click();
	}

	start() {
		cy.findAllByRole('button', { name: '✏️' }).eq(1).click();
		const startTime = dayjs();
		// const startTimeInput = startTime.tz('Pacific/Auckland').format('DD/MM/YYYY hh:mm a');
		const startTimeInput = startTime.tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm');
		cy.findByLabelText(/Start Date:/i).type(startTimeInput);
		cy.findByRole('button', { name: '✔️' }).click();

		// Check that GR has started
		cy.reload();
		this.expandAllDetails();
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

		const resourceUsageSection = () => cy.get('dialog > section').eq(1);

		usageOfResources.forEach((usageOfResource) => {
			const addResourceButton = resourceUsageSection().findByRole('button', { name: '➕' });
			addResourceButton.click();
			resourceUsageSection()
				.find('input[type="number"]')
				.type(usageOfResource.amountUsed.toString());
			resourceUsageSection().find('select').select(usageOfResource.resourceName);
			addResourceButton.click();
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

		const harvestsSection = () => cy.get('dialog > section').eq(2);

		harvests.forEach((harvest) => {
			const addHarvestButton = harvestsSection().findByRole('button', { name: 'Record' });
			addHarvestButton.click();
			harvestsSection().find('input[type="number"]').eq(0).type(harvest.numberOfLeaves.toString());
			harvestsSection().find('input[type="number"]').eq(1).type(harvest.massOfLeaves.toString());
			if (harvest.datetime === 'now') harvestsSection().find('input[type="checkbox"]').check();
			addHarvestButton.click();
		});
	}

	end() {
		const heroSection = () => cy.get('dialog > section').eq(0);

		cy.window().then((win) => {
			cy.findAllByRole('button', { name: '✏️' }).eq(1).click();
			let endTime = dayjs(win.Date());
			const endTimeInput = endTime.tz('Pacific/Auckland').format('YYYY-MM-DDTHH:mm');
			cy.findByLabelText(/End Date:/i).type(endTimeInput);
			cy.findByRole('button', { name: '✔️' }).click();

			cy.reload();
			this.expandAllDetails();
			const displayedStartTime = endTime.tz('UTC').format('D MMM YYYY, h:mm a');
			heroSection().findByText(displayedStartTime).should('be.visible');
		});
	}

	hideAllDetails() {
		closeModalButton(GrowRunManager.entityName).click();
	}
}
