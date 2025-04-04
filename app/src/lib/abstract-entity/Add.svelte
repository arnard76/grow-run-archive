<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { Entity } from '$lib/abstract-entity/entity';

	export let entity: Entity<any>;
	const { Inputs } = entity;

	let newRecord: any = {};
</script>

<AddTemplate onAdd={() => entity.API.add(newRecord)} addText={entity.names.actionNames.add}>
	<Inputs record={newRecord} />
</AddTemplate>
