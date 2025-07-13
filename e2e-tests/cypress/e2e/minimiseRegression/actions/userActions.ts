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
		this.testIsLoggedIn();
	}

	login(testLoggedIn = true) {
		this.logout();
		cy.visit('/login');
		cy.findByLabelText(/username/i).type(this.credentials.username);
		cy.findByLabelText(/password/i).type(this.credentials.password);
		cy.findByRole('button', { name: userActionNames.login }).click();
		if (testLoggedIn) this.testIsLoggedIn();
	}

	testIsLoggedIn() {
		cy.findByTitle(userActionNames.openMenu).realHover();
		cy.get('nav').contains(`Logged in as ${this.credentials.username}`).should('be.visible');
		cy.get('body').realHover({ position: 'topLeft' });
	}

	deleteUser() {
		cy.visit('/settings');
		actionsMenu.open();
		const deleteUserAction = userActionNames.deleteUser(this.credentials.username);
		cy.findByRole('button', { name: deleteUserAction }).click();
		const deleteActionModal = () => cy.findParentByHeading('dialog', deleteUserAction);

		deleteActionModal()
			.find('#confirm-delete-action')
			.type(`delete ${this.credentials.username} password ${this.credentials.password}`);

		deleteActionModal().findByRole('button', { name: deleteUserAction }).click();

		cy.url().should('include', '/welcome');
		this.testUserDeleted();
	}

	testUserDeleted() {
		this.logout();
		this.login(false);
		cy.findByText(`Logged in`).should('not.exist');
	}
}
