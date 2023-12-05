<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '$lib/grow-run/growRun';
	import { growRunsStore } from '$lib/grow-run/stores';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from './util';

	export let growRun: GrowRun;
	let expanded = false;
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
		Start:{prettyFormatDate(growRun.duration.start) || '-'}<br />
		End : {prettyFormatDate(growRun.duration.end) || '-'}
	</p>

	<Inputs
		slot="editing"
		bind:startDateInput={growRun.duration.start}
		bind:endDateInput={growRun.duration.end}
	/>
</EditTemplate>
