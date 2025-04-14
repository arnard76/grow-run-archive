<script lang="ts">
	import { goto } from '$app/navigation';
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import Loading from '$lib/components/Loading.svelte';

	export let data;

	let { entity, recordId } = data;
	const { DisplayRecord, Inputs, FullIndividualRecord } = entity;
	let { records, loading } = entity.store;
	$: record = $records.find((record) => record[entity.idProperty] === recordId);
	$: if (!$loading && !record) setTimeout(() => goto(`/${entity.names.URL}`), 5000);
	$: console.log({ record });
</script>

<Loading loading={$loading}>
	{#if record}
		{#if FullIndividualRecord}
			<FullIndividualRecord {record} />
		{:else}
			<EditTemplate
				onDelete={() => entity.API.delete(recordId)}
				onUpdate={() => entity.API.updateFull(record)}
			>
				<svelte:fragment slot="display">
					{#if record}
						{#if DisplayRecord}
							<DisplayRecord {record} />
						{:else}
							{#each Object.entries(record) as [property, value] (property)}
								<p>{property}: {value}</p>
							{/each}
						{/if}
					{/if}
				</svelte:fragment>

				<svelte:fragment slot="editing">
					<Inputs {record} />
				</svelte:fragment>
			</EditTemplate>
		{/if}
	{:else}
		<p>No record found with <code>{entity.idProperty}</code>: {recordId}</p>
		<p>Redirecting...</p>
	{/if}
</Loading>
