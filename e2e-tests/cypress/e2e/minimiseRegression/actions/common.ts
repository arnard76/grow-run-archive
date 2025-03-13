export function closeModalButton(modalName: string) {
	return cy.get('dialog button[title="Close ' + modalName + '"]').contains('❌');
}
