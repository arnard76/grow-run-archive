<script lang="ts">
	import type { GrowRun } from '@grow-run-archive/definitions';

	export let record: GrowRun;
</script>

<input type="text" placeholder="grow run name" bind:value={record.name} />
