export function login(username: string, password: string, checkLoggedIn = true) {
	cy.visit('/logout');
	cy.url().should('include', 'welcome');
	cy.visit('/login');
	cy.findByLabelText(/username/i).type(username);
	cy.findByLabelText(/password/i).type(password);
	cy.findByRole('button', { name: /submit/i }).click();
	if (checkLoggedIn) isLoggedIn(username);
}

export function isLoggedIn(username: string) {
	cy.findByText(`Logged in:`).should('be.visible');
	cy.findByText(username).should('be.visible');
}
