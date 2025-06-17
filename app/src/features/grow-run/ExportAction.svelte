<script lang="ts">
	import type GrowRun from '$features/grow-run';
	import { session } from '$lib/user/user';
	import dayjs from '@grow-run-archive/dayjs';
	import { JsonView } from '@zerodevx/svelte-json-view';

	export let growRun: GrowRun;

	function downloadGrowRunData() {
		const growRunData =
			'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(growRun));
		const downloadEl = document.createElement('a');
		downloadEl.setAttribute('href', growRunData);
		downloadEl.setAttribute(
			'download',
			`${$session.user?.uid}_${growRun.id}_${dayjs().toISOString()}.json`
		);
		downloadEl.click();
	}
</script>

<div class="my-4">
	<JsonView json={growRun} />
</div>
<button on:click={downloadGrowRunData}>Download</button>
