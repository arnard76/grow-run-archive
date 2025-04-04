<script lang="ts">
	import Add from '$lib/abstract-entity/Add.svelte';
	import EntityRecords from '$lib/abstract-entity/AllRecords.svelte';

	export let data;
	let { entity } = data;
	const { names, idProperty, store, API, Inputs } = entity;
	const { records, loading } = store;
</script>

<h1>{names.pluralName}</h1>
<Add {entity} />
<EntityRecords records={$records} {idProperty} entityURL={entity.names.URL} />
