import dayjs from 'dayjs';
import { login } from './actions/authActions';
import { GrowRunManager, growRunsManager } from './actions/growRunActions';
import { resourcesManager } from './actions/resourceActions';
import { formatResourcesAsObjects } from './util/convertStringRequirementsToObjects';

const exampleResources = formatResourcesAsObjects([
	'Resource: 80pcs seeds for $2.00 (from https://www.thewarehouse.co.nz/p/kiwi-garden-lettuce-butterhead-seeds/R2598667.html?gStoreCode=188',
	'Resource: 200mL nutrients for $14.99 (from https://gathera.com/products/re-plant-pack-rockwool?variant=40093526392966',
	'Resource: 9L coco coir for $5.91 (from https://www.bunnings.co.nz/daltons-9l-coir-briquette_p0241119'
]);

const resourceUsage1 = [
	'12x seeds',
	'10mL nutrients',
	'0.1L coco coir'
	// '100mL coco coir'
];

const resourceUsage2 = ['5mL nutrients'];

describe('Grow Run Archive', () => {
	let fastForwardedDays = 0;

	function fastForwardDays(numDays: number) {
		cy.clock().invoke('restore');
		fastForwardedDays += numDays;
		const fastForwardedDate = new Date(dayjs().add(fastForwardedDays, 'days').valueOf());
		cy.clock(fastForwardedDate, ['Date']);
	}

	before(() => {
		login(Cypress.env('CYPRESS_TEST_USER_EMAIL'), Cypress.env('CYPRESS_TEST_USER_PASSWORD'));
		resourcesManager.deleteAll();
		growRunsManager.deleteAll();
	});

	it('Common Grow Run Scenario', () => {
		resourcesManager.addMultiple(exampleResources);

		const growRun = new GrowRunManager('BCKIN AKL - Grow Run #17');
		growRun.showAllDetails();
		growRun.start();
		const growRunLocationCoords = {
			latitude: -36.86611935343806,
			longitude: 174.76589777209952
		};
		growRun.addLocationByCoords('coords', growRunLocationCoords);
		growRun.location.should('include.text', 'Auckland');

		growRun.location
			.find('a')
			.invoke('removeAttr', 'target')
			.invoke('attr', 'href')
			.should(
				'equal',
				`https://www.google.com/maps/place/${growRunLocationCoords.latitude},${growRunLocationCoords.longitude}`
			);
		growRun.manuallyRecordUsageOfResources(resourceUsage1);

		fastForwardDays(30);
		growRun.manuallyRecordHarvest(['30g 25leaves']);
		growRun.manuallyRecordUsageOfResources(resourceUsage2);

		fastForwardDays(20);
		growRun.manuallyRecordHarvest(['23g 15leaves']);

		fastForwardDays(13);
		growRun.manuallyRecordHarvest(['20g 13leaves']);

		fastForwardDays(1);
		growRun.end();
		growRun.duration.should('be.visible').should('contain.text', '64.00 days');

		// CHECK results - grow results and cost
		growRun.totalHarvest.should('be.visible').should('contain.text', '73.00g (53 leaves)');
		growRun.averageLeafWeight.should('be.visible').should('contain.text', '1.38g per leaf');
		growRun.totalCost.should('be.visible').should('contain.text', '$1.49');
		/** Default unit is {unitBasedOn: 'mass', amount: 100, unit: 'g'} */
		growRun.totalCostPerUnit.should('be.visible').should('contain.text', '$2.04');
	});
});
