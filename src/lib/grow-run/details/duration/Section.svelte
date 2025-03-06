<script lang="ts">
	import EditTemplate from '$lib/components/EditTemplate.svelte';
	import type GrowRun from '$lib/grow-run';
	import { growRunsAPI } from '$lib/grow-run/store';
	import Inputs from './Inputs.svelte';
	import { prettyFormatDate } from './util';

	export let growRun: GrowRun;
	let expanded = false;
	$: growRunDuration = growRun.calculateDurationInDays();
</script>

<section>
	<EditTemplate bind:expanded onUpdate={() => growRunsAPI.updateFull(growRun)}>
		<p slot="display">
			Ran from <span class="italic">{prettyFormatDate(growRun.duration.start) || '-'}</span>
			<br />to <span class="italic">{prettyFormatDate(growRun.duration.end) || '-'}</span>
		</p>
		<Inputs
			slot="editing"
			bind:startDateInput={growRun.duration.start}
			bind:endDateInput={growRun.duration.end}
		/>
	</EditTemplate>

	<p class="mt-4">
		Total duration {#if !expanded && growRunDuration}
			<i>
				{growRunDuration.toFixed(2)} days
			</i>
		{/if}
	</p>
</section>
