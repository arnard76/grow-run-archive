<script lang="ts">
	import { resourcesList, growRunsStore } from '$lib/data/stores';
	import type GrowRun from '$lib/model/growRun';
	import ResourceUsage from './ResourceUsage.svelte';
	import PieGraph from './PieGraph.svelte';
	import { uploadGrowSetupPhotos, downloadGrowSetupPhotos } from '$lib/data/photoStorage';

	export let growRun: GrowRun;

	let expanded = false;
	let selectedResourceToUse: string;

	let amountUsedInput: number;

	let massLeavesHarvestedInput: number;
	let numLeavesHarvestedInput: number;

	let growSetupPhotos: any[] = [];

	downloadGrowSetupPhotos(growRun).then((res) => (growSetupPhotos = res));

	$: cost = $resourcesList && growRun.calculateCost();
	$: costPer100g = ((cost * 100) / growRun.totalMassLeavesHarvested()).toFixed(2);

	$: pieChartData = $resourcesList && growRun.formatDataForPieChart();
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<tr class="preview" on:click={() => (expanded = !expanded)} on:keypress>
	<td>{growRun.name}</td>
	<td><a href="/experiment/{growRun.fromExperiment}">{growRun.fromExperiment}</a></td>
	<td>{growRun.totalMassLeavesHarvested()}</td>
	<td>{growRun.calculateDurationInDays() || '-'}</td>
	<td>${cost.toFixed(2)}</td>
	<td>${costPer100g}</td>
</tr>

<tr>
	<td colspan="10">
		{#if expanded}
			<h4>Resources Used</h4>

			<div class="resources-container">
				<section>
					{#if growRun.resources?.used?.length}
						<ul>
							{#each growRun.resources.used as { name, amountUsed }}
								{@const resource = resourcesList.getResource(name)}
								{#if resource}
									<ResourceUsage {resource} {amountUsed} />
								{/if}
							{/each}
						</ul>
					{:else}
						<p>
							Currently no resources have been used OR they usage has not been recorded. Try adding
							them below:
						</p>
					{/if}

					<label>
						<input type="number" bind:value={amountUsedInput} />
						{#if selectedResourceToUse === 'new'}
							<select>
								<option value="volume">volume</option>
								<option value="mass">mass</option>
								<option value="number">number</option>
							</select>
						{:else}
							<span>{resourcesList.getResource(selectedResourceToUse)?.amountUnit}</span>
						{/if}

						of
						<select name="" id="" required bind:value={selectedResourceToUse}>
							{#each Object.entries($resourcesList) as [id, resource]}
								<option value={resource.name}>{resource.name}</option>
							{/each}
							<option value="new">(new resource)</option>
						</select>

						{#if selectedResourceToUse === 'new'}
							<input type="text" name="" id="" placeholder="name of new resource" />
						{/if}
					</label>
					<button
						on:click={() => {
							growRun.addResourceUsage({
								amountUsed: amountUsedInput,
								name: selectedResourceToUse
							});
							growRunsStore.updateGrowRun(growRun);
						}}>Used</button
					>
				</section>
				<section>
					{#if growRun.resources?.used?.length}
						<PieGraph pie={pieChartData} sort="alphabet" />
					{/if}
				</section>
			</div>

			<h4>Harvests</h4>
			<div>
				<ul>
					{#each growRun.harvests as harvest}
						<li>{harvest.massOfLeaves}g ({harvest.numberOfLeaves} leaves)</li>
					{/each}
					<hr />
					<li class="summary">
						{growRun.totalMassLeavesHarvested()}g ({growRun.totalNumLeavesHarvested()} leaves)
					</li>
				</ul>

				<div>
					<label>
						I harvested <input type="number" bind:value={numLeavesHarvestedInput} /> leaves that
						weighed in at

						<input type="number" bind:value={massLeavesHarvestedInput} />g
					</label>
					<button
						on:click={() => {
							growRun.recordHarvest({
								massOfLeaves: massLeavesHarvestedInput,
								numberOfLeaves: numLeavesHarvestedInput
							});
							growRunsStore.updateGrowRun(growRun);
						}}
						>Record
					</button>
				</div>
			</div>

			<h4>Conditions</h4>
			more data...

			<h4>Grow setup photo</h4>
			<div class="grow-setup-photos">
				{#each growSetupPhotos as photo}
					<img src={URL.createObjectURL(photo)} alt="bleh" />
				{/each}
			</div>

			<input
				type="file"
				name=""
				id=""
				multiple
				on:change={async (e) => {
					const files = e.currentTarget.files;

					if (!files) return;

					console.log({ files });
					const filesList = [];
					let file;
					for (let fileIndexCounter = 0; fileIndexCounter < files.length; fileIndexCounter++) {
						file = files.item(fileIndexCounter);
						file && filesList.push(file);
					}
					const uploadResult = await uploadGrowSetupPhotos(growRun, filesList);
					console.log(uploadResult);

					growSetupPhotos = await downloadGrowSetupPhotos(growRun);
				}}
			/>
		{/if}
	</td>
</tr>

<style>
	.preview {
		cursor: pointer;
		background-color: lightblue;
	}

	.summary {
		font-weight: bold;
	}

	.resources-container {
		display: flex;
	}

	.grow-setup-photos img {
		width: 100px;
	}
</style>
