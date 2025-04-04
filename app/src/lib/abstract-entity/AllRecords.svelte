<script lang="ts">
	export let records: any[];
	export let explicitProperties: string[] | undefined = undefined;
	export let idProperty: keyof any;
	export let entityURL: string;
	export let individualLinkForRecord = (record: any) => `/${entityURL}/${record[idProperty]}`;

	let selected: any[] = [];
	$: properties = explicitProperties || (records.length ? Object.keys(records[0]) : undefined);
</script>

{#if records.length}
	<table>
		{#if properties}
			<thead>
				<tr>
					<th colspan="1">
						<input
							type="checkbox"
							checked={selected.length === records.length}
							on:click={() => {
								selected.length === records.length
									? (selected = [])
									: (selected = records.map((record) => record[idProperty]));
							}}
						/>
					</th>
					{#each properties as property (property)}
						{#if property !== idProperty}
							<th colspan="10">{property}</th>
						{/if}
					{/each}
				</tr>
			</thead>
		{/if}

		<tbody>
			{#each records as record (record[idProperty])}
				<tr>
					<td colspan="1">
						<input
							type="checkbox"
							checked={selected.includes(record[idProperty])}
							on:click={() => {
								// toggle selected
								selected.includes(record[idProperty])
									? selected.splice(
											selected.findIndex(
												(idOfSelectedRecord) => idOfSelectedRecord === record[idProperty]
											),
											1
										)
									: selected.push(record[idProperty]);
								selected = selected;
							}}
						/>
					</td>
					{#each Object.keys(records[0]) as property (property)}
						{#if property !== idProperty}
							<td colspan="10">
								<a href={individualLinkForRecord(record)} style="display: block;">
									{record[property]}
								</a>
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>No records</p>
{/if}

<style>
	td {
		max-width: 1rem;
	}
</style>
