<script lang="ts">
	export let actionName: string = '';

	import Icon from '@iconify/svelte';
	import CancelButton from '$lib/components/CancelButton.svelte';

	export let onComplete = () => null as any;
	export let onCancel = () => null as any;
</script>

<form>
	<slot />
	<div>
		<button title={actionName} on:click={onComplete}>
			<Icon icon="tabler:pencil-check" />
		</button>

		<CancelButton on:click={onCancel} />
	</div>
</form>
