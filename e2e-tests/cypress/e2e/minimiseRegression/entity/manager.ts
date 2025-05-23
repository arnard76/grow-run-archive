import { ActionNames } from '@grow-run-archive/definitions';

/**
 * This class is to represent any person who interacts with an entity on GRA
 *
 * an instance of this class could be: Arnav
 * and I could interact with the grow runs: GrowRunManager
 * by adding and deleting: grow runs
 */
export interface EntityManager {
	add(): void;
	delete(): void;
	goTo(): void;
}

export class EntitiesManager {
	entityName: string;
	entityPluralName: string;
	entityURL: string;
	entityActionNames: ActionNames;

	constructor(entityName: string, entityURL?: string) {
		this.entityName = entityName;
		this.entityActionNames = new ActionNames(this.entityName);
		this.entityPluralName = entityName + 's';
		this.entityURL =
			entityURL ||
			(this.entityPluralName
				? `/${this.entityPluralName.toLowerCase().replace(' ', '-')}`
				: undefined);
	}

	goToAll() {
		cy.visit(this.entityURL);
		cy.findByText('loading', { exact: false }).should('not.exist');
	}

	deleteSingle() {
		cy.findByTitle(this.entityActionNames.edit).click();
		cy.findByTitle(this.entityActionNames.delete).click();
	}

	deleteAll() {
		this.goToAll();
		const entities = cy.get('table tr');

		entities.each(($entity, index, ...rest) => {
			if (index === 0) return;
			cy.wrap($entity).click();
			this.deleteSingle();
		});
	}
}
