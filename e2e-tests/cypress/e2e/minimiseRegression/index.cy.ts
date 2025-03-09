import { login } from './actions/authActions';
import { GrowRunManager } from './actions/growRunActions';
import { addResources, clearAllResources } from './actions/resourceActions';
const numberMatchRegex = /[+-]?\d+(\.\d+)?/g;

const quantities = { mL: 'volume', L: 'volume', pcs: 'number' };

const exampleResources = [
	'Resource: 80pcs seeds for $2.00 (from https://www.thewarehouse.co.nz/p/kiwi-garden-lettuce-butterhead-seeds/R2598667.html?gStoreCode=188',
	'Resource: 200mL nutrients for $14.99 (from https://gathera.com/products/re-plant-pack-rockwool?variant=40093526392966',
	'Resource: 9L coco coir for $5.91 (from https://www.bunnings.co.nz/daltons-9l-coir-briquette_p0241119'
].map((resource: string) => {
	const amount = resource.match(numberMatchRegex)[0];
	const unit = resource.split(amount)[1].split(' ', 1)[0];
	const cost = resource.split(`${amount}${unit}`)[1].match(numberMatchRegex)[0];
	assert(resource.includes(` $${cost} `), "couldn't find resource cost from string definition");
	const quantity = quantities[unit];
	const name = resource.split(' for ')[0].split(`${unit} `)[1];

	return { name, cost, unit, quantity, amount };
});
const resourceUsage1 = [
	// 12x seeds
	// 10mL nutrients
	// 100mL coco coir
];

const resourceUsage2 = [
	// 5mL nutrients
];

describe('Grow Run Archive', () => {
	before(() => {
		login(Cypress.env('CYPRESS_TEST_USER_EMAIL'), Cypress.env('CYPRESS_TEST_USER_PASSWORD'));
		clearAllResources();
		GrowRunManager.clearAll();
	});
	it('Common Grow Run Scenario', () => {
		addResources(exampleResources);
		//
		const growRun = new GrowRunManager('Back in auckland motherfuckers');
		growRun.start();
		// growRun.manuallyRecordResourceUsage(resourceUsage1)
		// growRun.manuallyRecordHarvest(30g, 25leaves)
		// growRun.manuallyRecordResourceUsage(resourceUsage2)
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
	});
});
