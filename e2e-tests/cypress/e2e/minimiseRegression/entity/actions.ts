import { randomlySample } from '@/util/array';

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
		this.testModalIsClosed();
		cy.findByTitle(this.name, { exact: false }).should('be.visible');
		randomlySample(this.openMethods)();
		this.get().should('be.visible');
		return this.get();
	}

	close() {
		this.get().should('be.visible');
		randomlySample(this.closeMethods)();
		this.testModalIsClosed();
	}

	testModalIsClosed() {
		cy.findByRole('heading', { name: this.modalHeading }).should('not.exist');
	}

	get() {
		return cy.findParentByHeading('dialog', this.modalHeading);
	}
}

export class ActionsMenuModal extends ActionModal {
	constructor(name?: string | RegExp, modalHeading?: string | RegExp) {
		super(name || /actions/i, modalHeading);
		this.closeMethods.push(() => cy.realPress('/'));
		this.openMethods.push(() => cy.realPress('/'));
	}
}

export const actionsMenu = new ActionsMenuModal();

class ConfirmActionWarningModal extends ActionModal {
	constructor() {
		super(/confirm action/i, /are you sure?/i);
	}

	open = this.get;
	close = this.get;
	confirm = () => cy.findByTitle(this.name, { exact: false }).realClick();
}

export const confirmActionWarning = new ConfirmActionWarningModal();

/**
 * Suitable when multiple actions exist for this entity or record
 *
 * 1. Open actions menu for entity
 * 2. Select specific action
 * 3. Fill out action form
 * 4. Finish action
 * 5. Close action
 * 6. close actions menu
 *
 * NOTE: for confirming actions, the close action is part of the complete action
 */
export function performAction(
	actionsMenuModal: ActionsMenuModal,
	actionName: string,
	fillOutActionform = (_: ActionModal['get']) => null as any,
	actionHasToBeConfirmed = false
) {
	actionsMenuModal.open();
	actionsMenuModal.get().findByRole('button', { name: actionName }).click();

	if (actionHasToBeConfirmed) {
		confirmActionWarning.get();
		confirmActionWarning.confirm();
	} else {
		const actionModal = new ActionModal(actionName);
		actionModal.get();
		fillOutActionform(() => actionModal.get());
		actionModal.get().findByRole('button', { name: actionName }).click();
		actionModal.close();
	}
	actionsMenuModal.close();
}
