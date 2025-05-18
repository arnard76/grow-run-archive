import { db } from '@/services/database/neon-postgresql';
import { AnyPgTable, TableConfig } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';

export class EntityRepository<Type1 extends TableConfig> {
	table: AnyPgTable<Type1>;

	constructor(table: AnyPgTable<Type1>) {
		this.table = table;
	}

	get validators() {
		return {
			create: createInsertSchema(this.table),
			get: createSelectSchema(this.table),
			edit: createUpdateSchema(this.table),
			replace: createInsertSchema(this.table)
		};
	}

	async replace(newObject: typeof this.table.$inferInsert) {
		await db.update(this.table).set(newObject);
	}
}
