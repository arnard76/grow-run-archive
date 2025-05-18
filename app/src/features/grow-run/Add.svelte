<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsAPI } from '$features/grow-run/store';
	import { growRunActionNames } from '@grow-run-archive/definitions';

	let nameInput = '';
</script>

<AddTemplate addText={growRunActionNames.add} onAdd={() => growRunsAPI.add({ name: nameInput })}>
	<input type="text" placeholder="grow run name" bind:value={nameInput} />
</AddTemplate>
