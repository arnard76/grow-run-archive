export function signup(
	username: UserCredentials['username'],
	password: UserCredentials['password']
) {
	cy.visit('/logout');
	cy.url().should('include', 'welcome');
	cy.visit('/sign-up');
	cy.url().should('not.include', /logged in/i);
	cy.findByLabelText(/username/i).type(username);
	cy.findByLabelText('Password').type(password);
	cy.findByLabelText('Confirm Password').type(password);
	cy.findByRole('button', { name: /submit/i }).click();
	isLoggedIn(username);
}

export function login(
	username: UserCredentials['username'],
	password: UserCredentials['password'],
	checkLoggedIn = true
) {
	cy.visit('/logout');
	cy.url().should('include', 'welcome');
	cy.visit('/login');
	cy.findByLabelText(/username/i).type(username);
	cy.findByLabelText(/password/i).type(password);
	cy.findByRole('button', { name: /submit/i }).click();
	if (checkLoggedIn) isLoggedIn(username);
}

export function isLoggedIn(username: UserCredentials['username']) {
	cy.findByText(`Logged in:`).should('be.visible');
	cy.findByText(username).should('be.visible');
}
