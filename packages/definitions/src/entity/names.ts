import { ActionNames } from './actions';

export class EntityNames {
	name: string;
	pluralName: string;
	URL: string;
	actionNames: ActionNames;

	constructor(name: string, URL?: string, pluralName?: string, actionNames?: ActionNames) {
		this.name = name;
		this.actionNames = actionNames || new ActionNames(this.name);
		this.pluralName = pluralName || name + 's';
		this.URL = URL || EntityNames.urlFromEntityPluralName(this.pluralName);
	}

	private static urlFromEntityPluralName(entityPluralName: string) {
		return entityPluralName.toLowerCase().replace(' ', '-');
	}
}
