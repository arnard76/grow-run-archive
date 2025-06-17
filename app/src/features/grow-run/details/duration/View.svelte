<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import { prettyFormatDate } from './util';

	export let growRun: GrowRun;
	$: growRunDuration = growRun.calculateDurationInDays();
</script>

<section>
	<p>Started: <span class="italic">{prettyFormatDate(growRun.duration?.start) || '-'}</span></p>
	<p>Ended: <span class="italic">{prettyFormatDate(growRun.duration?.end) || '-'}</span></p>

	{#if growRunDuration}
		<p>Duration: <span class="italic">{growRunDuration.toFixed(2)} days</span></p>
	{/if}
</section>
