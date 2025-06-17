<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import { prettyFormatDate } from './util';

	export let growRun: GrowRun;
	$: growRunDuration = growRun.calculateDurationInDays();
</script>

<section>
	<p>
		Ran from <span class="italic">{prettyFormatDate(growRun.duration?.start) || '-'}</span>
		<br />to <span class="italic">{prettyFormatDate(growRun.duration?.end) || '-'}</span>
	</p>

	{#if growRunDuration}
		<p class="mt-4">
			Duration
			<i>
				{growRunDuration.toFixed(2)} days
			</i>
		</p>
	{/if}
</section>
