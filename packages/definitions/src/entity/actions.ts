export class ActionNames {
	entityName: string;

	constructor(entityName: string) {
		this.entityName = entityName;
	}

	get openActions() {
		return `Actions for ${this.entityName}s`;
	}

	get add() {
		return `Add ${this.entityName}`;
	}
	get edit() {
		return `Edit ${this.entityName}`;
	}
	get finishEdit() {
		return `Save Changes`;
	}
	get delete() {
		return `Delete ${this.entityName}`;
	}
	get deleteConfirm() {
		return `Are you sure you want to delete this ${this.entityName}`;
	}
	get close() {
		return `Close ${this.entityName}`;
	}
}
