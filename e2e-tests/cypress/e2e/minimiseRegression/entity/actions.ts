function randomlySample<B>(array: B[]): B {
	return array[Math.floor(Math.random() * array.length)];
}

export class ActionModal {
	name: string | RegExp;
	constructor(name: string | RegExp) {
		this.name = name;
	}

	openMethods: (() => any)[] = [() => cy.findByTitle(this.name, { exact: false }).click()];

	closeMethods: (() => any)[] = [
		() => cy.realPress('Escape'),
		() => cy.get('body').realClick({ x: 10, y: 10 })
	];

	open() {
		this.checkModalIsClosed();
		cy.findByTitle(this.name, { exact: false }).should('be.visible');
		randomlySample(this.openMethods)();
		this.get().should('be.visible');
		return this.get();
	}

	close() {
		this.get().should('be.visible');
		randomlySample(this.closeMethods)();
		this.checkModalIsClosed();
	}

	checkModalIsClosed() {
		cy.findByRole('heading', { name: this.name }).should('not.exist');
	}

	get() {
		return cy.findParentByHeading('dialog', this.name);
	}
}

class ActionsMenuModal extends ActionModal {
	constructor() {
		super(/actions/i);
		this.closeMethods.push(() => cy.realPress('/'));
		this.openMethods.push(() => cy.realPress('/'));
	}
}

export const actionsMenu = new ActionsMenuModal();
