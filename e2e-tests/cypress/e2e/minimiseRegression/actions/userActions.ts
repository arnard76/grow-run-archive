// AS SEEN/REMEMBERED BY USER
// NOT WHAT IS ACTUALLY STORED IN THE BACKEND
export type UserCredentials = {
	username: string;
	password: string;
};

export class User {
	credentials: UserCredentials;

	constructor(credentials: UserCredentials) {
		this.credentials = credentials;
	}

	logout() {
		cy.visit('/logout');
		cy.url().should('include', 'welcome');
	}

	signup() {
		this.logout();
		cy.visit('/sign-up');
		cy.url().should('not.include', /logged in/i);
		cy.findByLabelText(/username/i).type(this.credentials.username);
		cy.findByLabelText('Password').type(this.credentials.password);
		cy.findByLabelText('Confirm Password').type(this.credentials.password);
		cy.findByRole('button', { name: /submit/i }).click();
		this.isLoggedIn();
	}

	login(checkLoggedIn = true) {
		this.logout();
		cy.visit('/login');
		cy.findByLabelText(/username/i).type(this.credentials.username);
		cy.findByLabelText(/password/i).type(this.credentials.password);
		cy.findByRole('button', { name: /submit/i }).click();
		if (checkLoggedIn) this.isLoggedIn();
	}

	isLoggedIn() {
		cy.findByText(`Logged in:`).should('be.visible');
		cy.findByText(this.credentials.username).should('be.visible');
	}
}
