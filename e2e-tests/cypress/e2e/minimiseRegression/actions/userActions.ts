import { userActionNames } from '@grow-run-archive/definitions';
import { actionsMenu } from '../entity/actions';

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
		cy.findByRole('button', { name: userActionNames.signup }).click();
		this.isLoggedIn();
	}

	login(checkLoggedIn = true) {
		this.logout();
		cy.visit('/login');
		cy.findByLabelText(/username/i).type(this.credentials.username);
		cy.findByLabelText(/password/i).type(this.credentials.password);
		cy.findByRole('button', { name: userActionNames.login }).click();
		if (checkLoggedIn) this.isLoggedIn();
	}

	isLoggedIn() {
		cy.findByText(`Logged in:`).should('be.visible');
		cy.findByText(this.credentials.username).should('be.visible');
	}

	deleteUser() {
		cy.visit('/settings');
		actionsMenu.open();
		const deleteUserAction = userActionNames.deleteUser(this.credentials.username);
		cy.findByRole('button', { name: deleteUserAction }).click();
		cy.findParentByHeading('dialog', deleteUserAction)
			.find('#confirm-delete-action')
			.type(`delete ${this.credentials.username} password ${this.credentials.password}`);

		cy.findParentByHeading('dialog', deleteUserAction)
			.findByRole('button', { name: deleteUserAction })
			.click();

		cy.url().should('include', '/welcome');
		this.testUserDeleted();
	}

	testUserDeleted() {
		this.logout();
		this.login(false);
		cy.findByText(`Logged in:`).should('not.exist');
	}
}
