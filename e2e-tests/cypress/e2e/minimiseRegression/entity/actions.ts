function randomlySample<B>(array: B[]): B {
	return array[Math.floor(Math.random() * array.length)];
}

export class ActionModal {
	name: string | RegExp;
	modalHeading: string | RegExp;

	constructor(name: string | RegExp, modalHeading = name) {
		this.name = name;
		this.modalHeading = modalHeading;
	}

	openMethods: (() => any)[] = [() => cy.findByTitle(this.name, { exact: false }).realClick()];

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
		cy.findByRole('heading', { name: this.modalHeading }).should('not.exist');
	}

	get() {
		return cy.findParentByHeading('dialog', this.modalHeading);
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
