<script lang="ts">
	import { growRunsAPI } from '$features/grow-run/store';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import ActionTemplate from '../../lib/components/ActionTemplate.svelte';

	export let closeModal: () => any;

	let nameInput = '';
</script>

<ActionTemplate
	actionName={growRunActionNames.add}
	onCancel={closeModal}
	onComplete={() => growRunsAPI.add({ name: nameInput })}
>
	<input type="text" placeholder="grow run name" bind:value={nameInput} />
</ActionTemplate>
