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
	name: string;
	pluralName: string;
	URL: string;
	actionNames: ActionNames;

	constructor(entity: {
		name: string;
		pluralName?: string;
		URL?: string;
		actionNames?: ActionNames;
	}) {
		this.name = entity.name;
		this.actionNames = entity.actionNames || new ActionNames(this.name);
		this.pluralName = entity.pluralName || this.name + 's';
		this.URL = entity.URL || `/${this.pluralName.toLowerCase().replace(/ /g, '-')}`;
	}

	goToAllMethods: (() => any)[] = [() => cy.visit(this.URL)];

	goToAll() {
		randomlySample(this.goToAllMethods)();
		cy.findByText('loading', { exact: false }).should('not.exist');
		cy.url().should('contain', this.URL);
	}

	deleteSingle() {
		cy.findByTitle(this.actionNames.edit).click();
		cy.findByTitle(this.actionNames.delete).click();
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
