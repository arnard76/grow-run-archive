import dayjs from 'dayjs';
import { login } from './actions/authActions';
import { GrowRunManager } from './actions/growRunActions';
import { addResources, clearAllResources } from './actions/resourceActions';
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
		GrowRunManager.goToAllGrowRuns();
	}

	before(() => {
		login(Cypress.env('CYPRESS_TEST_USER_EMAIL'), Cypress.env('CYPRESS_TEST_USER_PASSWORD'));
		clearAllResources();
		GrowRunManager.clearAll();
	});

	it('Common Grow Run Scenario', () => {
		addResources(exampleResources);

		const growRun = new GrowRunManager('BCKIN AKL - Grow Run #17');
		growRun.expandAllDetails();
		growRun.start();
		growRun.manuallyRecordUsageOfResources(resourceUsage1);

		fastForwardDays(30);
		growRun.expandAllDetails();
		growRun.manuallyRecordHarvest(['30g 25leaves']);
		growRun.manuallyRecordUsageOfResources(resourceUsage2);

		fastForwardDays(20);
		growRun.expandAllDetails();
		growRun.manuallyRecordHarvest(['23g 15leaves']);

		fastForwardDays(13);
		growRun.expandAllDetails();
		growRun.manuallyRecordHarvest(['20g 13leaves']);

		fastForwardDays(1);
		growRun.expandAllDetails();
		growRun.end();

		// CHECK results - grow results and cost
		growRun.totalHarvest.should('be.visible').should('contain.text', '73.00g (53 leaves)');
		growRun.averageLeafWeight.should('be.visible').should('contain.text', '1.38g per leaf');
		growRun.totalCost.should('be.visible').should('contain.text', '$1.49');
		/** Default unit is {unitBasedOn: 'mass', amount: 100, unit: 'g'} */
		growRun.totalCostPerUnit.should('be.visible').should('contain.text', '$2.04');
	});
});
