describe('template spec', () => {
	it('passes', () => {
		cy.visit('http://localhost:5173/login');
		cy.findByRole('button', { name: /submit/i });
	});
});
