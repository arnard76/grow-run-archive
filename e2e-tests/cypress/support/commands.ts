/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
	namespace Cypress {
		interface Chainable {
			recursionLoop(fn: (times?: number) => any, times?: number): Chainable<void>;
			openHTML(html: string): Chainable<void>;
			findParentByHeading<K extends keyof HTMLElementTagNameMap>(
				parent: K,
				heading: string | RegExp
			): Chainable<JQuery<HTMLElementTagNameMap[K]>>;
		}
	}
}

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('recursionLoop', function (fn, times) {
	if (typeof times === 'undefined') {
		times = 0;
	}

	cy.then(async () => {
		const result = await fn(++times);
		if (result !== false) {
			cy.recursionLoop(fn, times);
		}
	});
});

Cypress.Commands.add('openHTML', function (html) {
	cy.document().invoke('open').invoke('write', html);
});

Cypress.Commands.add('findParentByHeading', function (parent, heading) {
	return cy.findByRole('heading', { name: heading }).parents(parent);
});
