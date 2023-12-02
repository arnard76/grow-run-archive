<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '$lib/grow-run/growRun';
	import { growRunsStore } from '$lib/grow-run/stores';
	import Inputs from './Inputs.svelte';

	export let growRun: GrowRun;
	let expanded = false;

	function formatDate(date: string) {
		if (date === '-') return;

		return new Date(date).toLocaleString();
	}
</script>

<p style="font-style: italic;">
	Duration: {#if !expanded}
		<span style="font-weight: bold; font-style: initial;">
			{growRun.calculateDurationInDays()
				? growRun.calculateDurationInDays().toFixed(2) + ' days'
				: '-'}
		</span>
	{/if}
</p>

<EditTemplate bind:expanded onClick={() => growRunsStore.updateGrowRun(growRun)}>
	<p slot="display" style="display: inline-block;">
		Start:{formatDate(growRun.duration.start)}<br />
		End : {formatDate(growRun.duration.end)}
	</p>

	<Inputs
		slot="editing"
		bind:startDateInput={growRun.duration.start}
		bind:endDateInput={growRun.duration.end}
	/>
</EditTemplate>
