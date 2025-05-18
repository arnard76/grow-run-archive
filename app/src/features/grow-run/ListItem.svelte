<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import Preview from './Preview.svelte';

	export let growRun: GrowRun;
</script>

<Preview {growRun} />
