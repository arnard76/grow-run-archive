import { EntityNames } from '@grow-run-archive/definitions';
import { EntityStore } from '$lib/abstract-entity/store';
import { EntityAPI } from '$lib/abstract-entity/api';

export class Entity<Type> {
	idProperty: keyof Type;
	names: EntityNames;
	API: EntityAPI<Type>;
	store: EntityStore<Type>;
	Inputs?: any;
	DisplayRecord?: any;
	FullIndividualRecord?: any;

	constructor(entityDefinition: {
		names: EntityNames;
		idProperty?: keyof Type;
		API?: EntityAPI<Type>;
		store?: EntityStore<Type>;
		Inputs?: any;
		DisplayRecord?: any;
		Class?: any;
		FullIndividualRecord?: any;
	}) {
		const { names, idProperty, API, store, Inputs, DisplayRecord, FullIndividualRecord, Class } =
			entityDefinition;
		this.names = names;
		this.idProperty = idProperty || ('id' as any);
		this.API = API || new EntityAPI<Type>(this.names.URL, this.idProperty);
		this.store = store || new EntityStore(this.API, Class);
		this.Inputs = Inputs;
		this.DisplayRecord = DisplayRecord;
		this.FullIndividualRecord = FullIndividualRecord;
	}
}
