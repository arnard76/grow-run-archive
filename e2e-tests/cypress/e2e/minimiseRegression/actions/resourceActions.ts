type Resource = any;

export function addResource(resource: Resource) {
	cy.visit('/resources');
	const addResourceButton = cy.findByRole('button', { name: /Add to list/i });
	addResourceButton.click();

	cy.findByPlaceholderText(/resource name/i).type(resource.name);
	cy.findByPlaceholderText(/cost for amount/i).type(resource.cost);
	cy.findByPlaceholderText('amount', { exact: true }).type(resource.amount);
	cy.findByTitle('Select how the amount of this resource is specified').select(resource.quantity);
	cy.findByTitle('Select the unit of measuring an amount of this resource').select(resource.unit);
	// cy.findByLabelText('product link').type(
	// 	'https://www.thewarehouse.co.nz/p/kiwi-garden-lettuce-butterhead-seeds/R2598667.html?srsltid=AfmBOoowGtKN5J2-GXV1U_bHxy-Hw_5MeMAgGA98eQTrduCCh3i5cwe1oNI&gStoreCode=188'
	// );
	addResourceButton.click();
}

export function addResources(resources: Resource[]) {
	resources.forEach((resource) => addResource(resource));
}

export function clearAllResources() {
	cy.visit('/resources');
	cy.wait(4000);
	const resourcesList = cy.get('table tr');

	resourcesList.each(($resourceItem, index) => {
		if (index === 0) return;
		cy.wrap($resourceItem).click();
		cy.findByRole('button', { name: '✏️' }).click();
		cy.findByTitle(/Delete/i).click();
	});
}
