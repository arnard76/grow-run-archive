import {
	ConditionMeasurement,
	ConditionsMeasurements,
	Coords,
	displayFormatForDateTime,
	ExternalConditionsMeasurements,
	GrowRun,
	growRunActionNames,
	Harvest,
	ResourceUsage,
	verboseConditionName
} from '@grow-run-archive/definitions';
import dayjs from 'dayjs';
import Timezone from 'dayjs/plugin/timezone';
import DayJSUtc from 'dayjs/plugin/utc';
import { EntitiesManager, EntityManager } from '../entity/manager';
import {
	formatHarvestsAsObjects,
	formatUsageOfResourcesAsObjects
} from '../util/convertStringRequirementsToObjects';

dayjs.extend(Timezone);
dayjs.extend(DayJSUtc);

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
const mockLocation = (coords: Coords) => ({
	onBeforeLoad(win) {
		cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb, err) => {
			if (coords.latitude && coords.longitude) {
				return cb({ coords });
			}
		});
	}
});

export class GrowRunManager implements EntityManager {
	growRunName: GrowRun['name'];

	constructor(growRunName: GrowRun['name'], existingGrowRun = false) {
		this.growRunName = growRunName;
		growRunsManager.goToAll();
		if (!existingGrowRun) this.add();
	}

	add() {
		const addGrowRunButton = () => cy.findByTitle(growRunActionNames.add);
		addGrowRunButton().click();
		cy.findByPlaceholderText(/grow run name/i).type(this.growRunName);
		addGrowRunButton().click();
	}

	delete() {}

	get preview() {
		return cy.contains('tr', this.growRunName);
	}

	goTo() {
		this.preview.findByRole('link').click();
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

		this.heroSection.findByRole('button', { name: growRunActionNames.addLocation }).click();
		if (typeof value === 'string') {
		}

		if (method === 'address search') {
			if (typeof value !== 'string') throw Error('value must be string, not Coords');
			this.heroSection.findAllByLabelText(/address/i).type(value);
			this.heroSection.find('select').select(value);
		} else if (method === 'coords') {
			if (typeof value === 'string') throw Error('value must be Coords, not string');
			this.heroSection.findByLabelText(/latitude/i).type(value.latitude.toString());
			this.heroSection.findByLabelText(/longitude/i).type(value.longitude.toString());
		} else if (method === 'device location') {
			this.heroSection.findByRole('button', { name: /use my location/i });
		} else {
			throw Error(`Method ${method} can not be used to add a grow run location.`);
		}

		this.heroSection.should('include.text', 'Address: ');
		this.heroSection.findByRole('button', { name: growRunActionNames.finishEdit }).click();
		if (method === 'address search')
			this.heroSection.contains(value as string).should('be.visible');
	}

	get location() {
		return this.heroSection.find('p').eq(0).findByRole('link').invoke('removeAttr', 'target');
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
			const addResourceButton = () =>
				this.resourceUsageSection.findByRole('button', { name: 'Record' });
			addResourceButton().click();
			this.resourceUsageSection
				.find('input[type="number"]')
				.type(usageOfResource.amountUsed.toString());
			this.resourceUsageSection.find('select').select(usageOfResource.resourceName);
			addResourceButton().click();
		});
	}

	get heroSection() {
		return cy.get('dialog > section').eq(0).scrollIntoView();
	}

	get resourceUsageSection() {
		return cy.get('dialog > section').eq(1).scrollIntoView();
	}

	get harvestsSection() {
		return cy.get('dialog > section').eq(2).scrollIntoView();
	}

	get conditions() {
		return cy.get('dialog > section').eq(3).scrollIntoView();
	}

	getSpecificConditionData(conditionName: keyof ConditionsMeasurements) {
		return this.conditions
			.find('section')
			.contains(conditionName)
			.find('ul')
			.findAllByRole('listitem');
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
			const addHarvestButton = () => this.harvestsSection.findByRole('button', { name: 'Record' });
			addHarvestButton().click();
			this.harvestsSection
				.find('input[type="number"]')
				.eq(0)
				.type(harvest.numberOfLeaves.toString());
			this.harvestsSection.find('input[type="number"]').eq(1).type(harvest.massOfLeaves.toString());
			if (harvest.datetime === 'now') this.harvestsSection.find('input[type="checkbox"]').check();
			addHarvestButton().click();
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

	// YOU COULD EITHER RECORD ALL MEASUREMENTS FOR A SINGLE CONDITION, THEN MOVE ON TO ANOTHER CONDITION
	// ORRRRR
	// RECORD THE MEASUREMENT FOR EVERY CONDITION AT A SPECIFIC TIMESTAMP, AND MOVE ONTO THE NEXT TIME (MORE LIKELY)
	recordEnvironmentalConditions(
		timestamp: ExternalConditionsMeasurements['dateTime'],
		conditions: ExternalConditionsMeasurements['conditions']
	) {
		cy.url().then(async (url) => {
			const growRunId = url.split(growRunsManager.entityURL + '/')[1];
			expect(growRunId).to.be.a('string').with.length.greaterThan(6);
			const response = await fetch('/grow-runs/grow-environment/device-data', {
				method: 'post',
				body: JSON.stringify({
					user: {
						username: Cypress.env('CYPRESS_TEST_USER_EMAIL'),
						password: Cypress.env('CYPRESS_TEST_USER_PASSWORD')
					},
					growRunId,
					dateTime: timestamp,
					...conditions
				})
			});
			expect(response.status).to.equal(201);
		});
	}

	testEnvironmentalConditions(
		condition: keyof ExternalConditionsMeasurements['conditions'],
		value: ConditionMeasurement['value'],
		time: ConditionMeasurement['dateTime']
	) {
		this.conditions
			.find('section')
			.contains(verboseConditionName(condition))
			.parent()
			.as('conditionSection');
		cy.get('@conditionSection')
			.findByRole('button', { name: /Show records/i })
			.click();
		cy.get('@conditionSection')
			.find('ul li')
			.should('contain.text', displayFormatForDateTime(time))
			.should('contain.text', `${value}°C`);
	}

	end() {
		cy.window().then((win) => {
			this.heroSection.find(`button[title='${growRunActionNames.changeStartAndEnd}']`).click();
			let endTime = dayjs(win.Date());
			const endTimeInput = endTime.format('YYYY-MM-DDTHH:mm');
			cy.findByLabelText(/End Date:/i).type(endTimeInput);
			this.heroSection.find(`button[title='${growRunActionNames.finishEdit}']`).click();

			cy.reload();
			const displayedStartTime = endTime.format('D MMM YYYY, h:mm a');
			this.heroSection.findByText(displayedStartTime).should('be.visible');
		});
	}

	hideAllDetails() {
		cy.get(`dialog button[title="${growRunActionNames.close}"]`).click();
	}
}
