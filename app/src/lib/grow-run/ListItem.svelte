<script lang="ts">
	import type GrowRun from '$lib/grow-run';
	import Preview from './Preview.svelte';

	export let growRun: GrowRun;
</script>

<Preview {growRun} />
