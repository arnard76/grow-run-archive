<script lang="ts">
	import type { Harvest } from '@grow-run-archive/definitions';
	import { prettyFormatDate } from '../../details/duration/util';

	export let harvest: Harvest;
</script>

<li>
	<p class="flex flex-wrap w-full">
		<span class="italic flex-1">{prettyFormatDate(harvest.datetime)}</span>

		<span class="flex-grow-0">
			{harvest.massOfLeaves}g ({harvest.numberOfLeaves} leaves)
		</span>
	</p>
</li>
