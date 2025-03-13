<script lang="ts">
	import AddTemplate from '$lib/components/AddTemplate.svelte';
	import { growRunsAPI } from '$lib/grow-run/store';

	let nameInput = '';
</script>

<AddTemplate addText="Start a new grow run" onClick={() => growRunsAPI.add({ name: nameInput })}>
	<input type="text" placeholder="grow run name" bind:value={nameInput} />
</AddTemplate>
