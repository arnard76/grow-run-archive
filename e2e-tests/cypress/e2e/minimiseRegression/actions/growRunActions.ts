import { GrowRun, Harvest, ResourceUsage } from '@grow-run-archive/definitions';
import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
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
		GrowRunManager.goToAllGrowRuns();
		cy.wait(4000);
		const growRuns = cy.get('table tr');

		growRuns.each(($growRun, index) => {
			if (index === 0) return;
			cy.wrap($growRun).click();
			cy.findByRole('button', { name: /Delete Grow Run/i }).click();
		});
	}

	growRunName: GrowRun['name'];

	constructor(growRunName: GrowRun['name'], existingGrowRun = false) {
		this.growRunName = growRunName;
		if (existingGrowRun) return;

		GrowRunManager.goToAllGrowRuns();
		const addGrowRunButton = cy.findByRole('button', { name: /add grow run/i });
		addGrowRunButton.click();
		cy.findByPlaceholderText(/grow run name/i).type(growRunName);
		addGrowRunButton.click();
	}

	static goToAllGrowRuns() {
		cy.visit('/');
	}

	private get growRunPreview() {
		return cy.contains('tr', this.growRunName);
	}

	goToGrowRun() {
		this.growRunPreview.click();
	}

	expandAllDetails = this.goToGrowRun;

	start() {
		cy.findAllByRole('button', { name: '✏️' }).eq(1).click();
		const startTime = dayjs();
		const startTimeInput = startTime.format('YYYY-MM-DDTHH:mm');
		cy.findByLabelText(/Start Date:/i).type(startTimeInput);
		cy.findByRole('button', { name: '✔️' }).click();

		// Check that GR has started
		cy.reload();
		this.expandAllDetails();
		const displayedStartTime = startTime.tz('UTC').format('D MMM YYYY, h:mm a');
		cy.findByText(displayedStartTime).should('be.visible');
	}

	private get resourceUsageSection() {
		return cy.get('dialog > section').eq(1);
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
			const addResourceButton = this.resourceUsageSection.findByRole('button', { name: '➕' });
			addResourceButton.click();
			this.resourceUsageSection
				.find('input[type="number"]')
				.type(usageOfResource.amountUsed.toString());
			this.resourceUsageSection.find('select').select(usageOfResource.resourceName);
			addResourceButton.click();
		});
	}

	private get harvestsSection() {
		return cy.get('dialog > section').eq(2);
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
		return this.harvestsSection
			.find('.summary')
			.contains('Total')
			.parent()
			.children()
			.eq(1)
			.scrollIntoView();
	}

	get averageLeafWeight() {
		return this.harvestsSection
			.find('.summary')
			.contains('Average')
			.parent()
			.children()
			.eq(1)
			.scrollIntoView();
	}

	get totalCost() {
		return this.resourceUsageSection
			.find('li')
			.contains('Total cost')
			.parent()
			.children()
			.eq(1)
			.scrollIntoView();
	}

	get totalCostPerUnit() {
		GrowRunManager.goToAllGrowRuns();
		return this.growRunPreview.find('td').eq(3);

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
		const heroSection = () => cy.get('dialog > section').eq(0);

		cy.window().then((win) => {
			cy.findAllByRole('button', { name: '✏️' }).eq(1).click();
			let endTime = dayjs(win.Date());
			const endTimeInput = endTime.format('YYYY-MM-DDTHH:mm');
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
