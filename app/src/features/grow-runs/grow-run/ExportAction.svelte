<!-- TODO: export should also include the photos -->
<script lang="ts">
	import type GrowRun from '$features/grow-runs/grow-run';
	import { session } from '$features/user/session';
	import dayjs from '@grow-run-archive/dayjs';
	import { growRunActionNames } from '@grow-run-archive/definitions';
	import { JsonView } from '@zerodevx/svelte-json-view';

	export let growRun: GrowRun;
	export let closeModal: () => any;

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
		closeModal();
	}
</script>

<h3 class="m-0 mb-4">{growRunActionNames.export}</h3>

<div class="my-4">
	<JsonView json={growRun} />
</div>
<button on:click={downloadGrowRunData}>Download</button>
