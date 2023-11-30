<script>
	import Menu from '$lib/components/Menu.svelte';
	import { resourcesList, growRunsStore } from '$lib/grow-run/stores';

	$: console.log($resourcesList);
	$: console.log($growRunsStore);
</script>

<Menu />
<slot />
