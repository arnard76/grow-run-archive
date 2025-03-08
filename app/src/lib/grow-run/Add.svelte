<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsStore } from '$lib/grow-run/store';

	let nameInput = '';
</script>

<AddTemplate addText="Add grow run" onClick={() => growRunsStore.addGrowRun({ name: nameInput })}>
	<input type="text" placeholder="grow run name" bind:value={nameInput} />
</AddTemplate>
