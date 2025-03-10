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
	before(() => {
		login(Cypress.env('CYPRESS_TEST_USER_EMAIL'), Cypress.env('CYPRESS_TEST_USER_PASSWORD'));
		clearAllResources();
		GrowRunManager.clearAll();
	});
	it('Common Grow Run Scenario', () => {
		addResources(exampleResources);

		const growRun = new GrowRunManager('Back in auckland motherfuckers');
		growRun.expandAllDetails();
		growRun.start();
		growRun.manuallyRecordUsageOfResources(resourceUsage1);
		// growRun.manuallyRecordHarvest(30g, 25leaves)
		growRun.manuallyRecordUsageOfResources(resourceUsage2);
		// growRun.manuallyRecordHarvest(23g, 15leaves)
		// growRun.manuallyRecordHarvest(20g, 13leaves)
		// growRun.end()
		//
		// CHECK results - grow results and cost
		// growRun.totalHarvestInLeaves().should('be.visible).should('be.equal', 53leaves)
		// growRun.totalHarvestInGrams().should('be.visible).should('be.equal', 73g)
		// growRun.averageLeafWeight().should('be.visible).should('be.equal', 1.4g)
		//
		// growRun.totalCost().should('be.visible').should('be.equal', $1.49)
		/** Default unit is {unitBasedOn: 'mass', amount: 100, unit: 'g'} */
		// growRun.totalCostPerUnit().should('be.visible').should('be.equal', $2.04)
		// ...
		growRun.hideAllDetails();
	});
});
