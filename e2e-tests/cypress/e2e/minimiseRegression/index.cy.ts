import dayjs from 'dayjs';
import { login } from './actions/authActions';
import { GrowRunManager, growRunsManager } from './actions/growRunActions';
import { resourcesManager } from './actions/resourceActions';
import { formatResourcesAsObjects } from './util/convertStringRequirementsToObjects';
import { fastForwardDays, fastForwardedDays } from './util/fastForward';
import { displayFormatForDateTime, verboseConditionName } from '@grow-run-archive/definitions';

const exampleResources = formatResourcesAsObjects([
	'80pcs seeds for $2.00 (from https://www.thewarehouse.co.nz/p/kiwi-garden-lettuce-butterhead-seeds/R2598667.html?gStoreCode=188',
	'200mL nutrients for $14.99 (from https://gathera.com/products/re-plant-pack-rockwool?variant=40093526392966',
	'9L coco coir for $5.91 (from https://www.bunnings.co.nz/daltons-9l-coir-briquette_p0241119'
]);

const resourceUsage1 = [
	'12x seeds',
	'10mL nutrients',
	'0.1L coco coir'
	// '100mL coco coir'
];

const resourceUsage2 = ['5mL nutrients'];

describe('Grow Run Archive', () => {
	before(() => {
		login(Cypress.env('CYPRESS_TEST_USER_EMAIL'), Cypress.env('CYPRESS_TEST_USER_PASSWORD'));
		// resourcesManager.deleteAll();
		growRunsManager.deleteAll();
	});

	it('analyses a common grow run', () => {
		let daysPassedAtStart = fastForwardedDays;
		// resourcesManager.addMultiple(exampleResources);

		const growRun = new GrowRunManager('BCKIN AKL - Grow Run #17');
		growRun.showAllDetails();
		growRun.start();

		// TODO: add location by address search
		// growRun.addLocation('address search', '7 Auburn Street, Grafton, Auckland');
		const growRunLocationCoords = {
			latitude: -36.86611935343806,
			longitude: 174.76589777209952
		};
		growRun.addLocationByCoords('coords', growRunLocationCoords);
		growRun.location
			.should('include.text', 'Auckland')
			.invoke('attr', 'href')
			.should(
				'equal',
				`https://www.google.com/maps/place/${growRunLocationCoords.latitude},${growRunLocationCoords.longitude}`
			);

		// DOESN"T WORK ON CHROME, WORKS ON EDGE
		// cy.origin('https://www.google.com', () => {
		// 	cy.url().should(
		// 		'include',
		// 		`https://www.google.com/maps/place/36%C2%B051'58.0%22S+174%C2%B045'57.2%22E/@-36.8661194,174.7658978,17z`
		// 	);
		// });

		growRun.manuallyRecordUsageOfResources(resourceUsage1);

		fastForwardDays(30);
		growRun.manuallyRecordHarvest(['30g 25leaves']);
		growRun.manuallyRecordUsageOfResources(resourceUsage2);

		// test environmental conditions
		const condition = 'air-temperature';
		const value = 9; // °C
		const time = dayjs().toISOString();
		growRun.recordEnvironmentalConditions(time, { [condition]: value });

		growRun.conditions
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

		fastForwardDays(20);
		growRun.manuallyRecordHarvest(['23g 15leaves']);

		fastForwardDays(13);
		growRun.manuallyRecordHarvest(['20g 13leaves']);

		fastForwardDays(1);
		growRun.end();
		growRun.duration
			.should('be.visible')
			.should('contain.text', `${(fastForwardedDays - daysPassedAtStart).toFixed(2)} days`);

		// CHECK results - grow results and cost
		growRun.totalHarvest.should('be.visible').should('contain.text', '73.00g (53 leaves)');
		growRun.averageLeafWeight.should('be.visible').should('contain.text', '1.38g per leaf');
		growRun.totalCost.should('be.visible').should('contain.text', '$1.49');
		/** Default unit is {unitBasedOn: 'mass', amount: 100, unit: 'g'} */
		growRun.totalCostPerUnit.should('be.visible').should('contain.text', '$2.04');
	});
});
