describe('template spec', () => {
	it('passes', () => {
		cy.visit('/login');
		cy.findByRole('button', { name: /submit/i });
	});
});
