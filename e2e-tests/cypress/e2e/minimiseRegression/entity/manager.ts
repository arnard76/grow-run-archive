import { ActionNames } from '@grow-run-archive/definitions';
import { randomlySample } from '@/util/array';

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
		this.entityURL = entityURL || `/${this.entityPluralName.toLowerCase().replace(/ /g, '-')}`;
	}

	goToAllMethods: (() => any)[] = [() => cy.visit(this.entityURL)];

	goToAll() {
		randomlySample(this.goToAllMethods)();
		cy.findByText('loading', { exact: false }).should('not.exist');
		cy.url().should('contain', this.entityURL);
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
